import * as config from '../config/ScrapeConfigs.json'
import { ProductType } from '../repositories/ProductsRepository'
import Accounting from '../utils/accounting'
import vanillaPuppeteer from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'
import { addExtra } from "puppeteer-extra"
import Stealth from "puppeteer-extra-plugin-stealth"
import ProductService from './ProductService'
import NotificationService from './NotificationService'
const puppeteer = addExtra(vanillaPuppeteer as any)
puppeteer.use(Stealth())

interface PuppeteerClusterParams {
  page: vanillaPuppeteer.Page
  data: {
    prod: {
      store: string,
      url: string
    }
    userid: string
  }
}

interface InfinitePuppeterClusterParams {
  page: vanillaPuppeteer.Page
  data: ProductType
}

//still need to handle unavailable products
export default new class ScrapingService {
  supportedStores = ["kabum", "pichau", "terabyte"]
  storesThatChangePriceXpath = ["kabum", "pichau"]

  async startInfiniteScraping () {
    const cluster = await this.generateCluster(1, true)
    const StartRecursiveScrapingQueue = async() => {
      const products: Array<ProductType> = await ProductService.getAllProducts()
      for(const product of products) {
        cluster.queue(product, async({ page, data }: InfinitePuppeterClusterParams) => {
          await page.goto(product.url)
          const notFormattedPrice = await this.getProductPrice(product.store, page)
          const formattedPrice = Accounting.formatPriceToFloat(notFormattedPrice)
          await this.handleProductChange(product, formattedPrice)
        })
      }
      //waits until all the cluster tasks are fulfilled
      await cluster.idle()
      //do it again
      await StartRecursiveScrapingQueue()
    }
    await StartRecursiveScrapingQueue()
    await cluster.close()
  }

  //change to another service
  async handleProductChange(product: ProductType, currentPrice: number) {
    try{
      if(currentPrice === product.price) return
      if(currentPrice > product.price) {
        await NotificationService.handlePrices(product, currentPrice, 'priceLower')
      }
      if(currentPrice < product.price) {
        await NotificationService.handlePrices(product, currentPrice, 'priceLower')
      }
      await ProductService.updateProductPrice(product, currentPrice)
    }catch(e) {
      console.error(e)
    }
  }

  async generateCluster(maxConcurrency: number, headless: boolean): Promise<Cluster> {
    const cluster: Cluster = await Cluster.launch({
      puppeteer,
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency,
      puppeteerOptions: {
        //@ts-ignore
        headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });
    return cluster
  }

  //initial info gathering when the user inserts a new product
  async getManyProductsInfo (products: [string]): Promise<any> {
    //: Promise<[ProductType]>
    const productsWithStore = products.map((p) => {
      return { store: this.detectStore(p), url: p }
    })
    let productsWithInfo: Array<ProductType> = []

    const cluster: Cluster = await this.generateCluster(1, true)
    for(const prod of productsWithStore) {
      cluster.queue({ prod }, async ({page, data}: PuppeteerClusterParams): Promise<any> => {
        const fullProduct = {
          url: data.prod.url,
          store: data.prod.store,
          name: '',
          price: 0,
          imgUrl: ''
        }
        await page.goto(fullProduct.url)
        fullProduct.name = await this.getProductName(fullProduct.store, page)
        fullProduct.imgUrl = await this.getProductImage(fullProduct.store, page)
        const notFormattedPrice = await this.getProductPrice(fullProduct.store, page)
        const formattedPrice = Accounting.formatPriceToFloat(notFormattedPrice)
        fullProduct.price = formattedPrice
        productsWithInfo.push(fullProduct)
      })
    }

    await cluster.idle();
    await cluster.close();
    return productsWithInfo
  }

  async getProductName(store: string, page: vanillaPuppeteer.Page): Promise<any> {
    try{
      let titleXpath: string = config.titleElement[store as 'kabum' | 'terabyte' | 'pichau'] 
      await page.waitForXPath(titleXpath)
      const titleElement = await page.$x(titleXpath)
      const title = await page.evaluate(el => el.textContent, titleElement[0])
      return title
    }catch(e) {
      console.error('Error while trying to get product name')
    }
  }

  async getProductImage(store: string, page: vanillaPuppeteer.Page): Promise<string> {
    let imgUrlXpath: string = config.imageElement[store as 'kabum' | 'terabyte' | 'pichau']
    await page.waitForXPath(imgUrlXpath)
    let imgUrlElement = await page.$x(imgUrlXpath)
    const imgUrl = await page.evaluate(el => el.getAttribute('src'), imgUrlElement[0])
    return Promise.resolve(imgUrl)
  }

  async getProductPrice(store: string, page: vanillaPuppeteer.Page): Promise<string> {
    let price = ''
    if(this.storesThatChangePriceXpath.includes(store)) {
      price = await this.getProductPriceWithDiscount(store, page)
      return price
    }
    const priceXpath: string = config.priceElement[store as 'kabum' | 'terabyte' | 'pichau'] 
    await page.waitForXPath(priceXpath)
    const priceElement = await page.$x(priceXpath)
    price = await page.evaluate(el => el.innerText, priceElement[0])
    return Promise.resolve(price)
  }

  async getProductPriceWithDiscount(store: string, page: vanillaPuppeteer.Page): Promise<string> {
    let price = ''
    //switch doesnt work for some reason
    if(store === 'pichau') {
      price = await this.handlePichauDiscount(page)  
    }
    // else if (store === 'kabum') {
    //   price = await this.handleKabumDiscount(page) 
    // }
    return price
  }

  async handlePichauDiscount(page: vanillaPuppeteer.Page): Promise<string> {
    const normalPriceElement: any = await page.$x(config.priceElement['pichau'])
    let pageIndex = 0
    if(normalPriceElement.length > 1) {
      pageIndex = 1
    }
    const price: string = await page.evaluate(el => el.innerText, normalPriceElement[pageIndex])
    return price
  }

  // async handleKabumDiscount(page: vanillaPuppeteer.Page): Promise<string> {
  //   let price: string = ''
  //   const normalPriceElement: any = await page.$x(config.priceElement['kabum'])
  //   if(normalPriceElement.length > 0) {
  //     price = await page.evaluate(el => el.innerText, normalPriceElement[0])
  //     return price
  //   }
  //   const priceElementWithDiscount: any = await page.$x(config.priceElementWithPromo['kabum'])
  //   console.log(priceElementWithDiscount.length)
  //   price = await page.evaluate(el => el.innerText, priceElementWithDiscount[0])
  //   return price
  // }

  detectStore (url: string): string | boolean {
    for(let store of this.supportedStores) {
      if (url.includes(store)) return store
    }
    return false
  }
}
