import * as config from '../config/ScrapeConfigs.json'
import { ProductType } from '../repositories/ProductsRepository'
import accounting from 'accounting-js' 

import vanillaPuppeteer from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'
import { addExtra } from "puppeteer-extra"
import Stealth from "puppeteer-extra-plugin-stealth"
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

export default new class ScrapingService {
  supportedStores = ["kabum", "pichau", "terabyte"]
  storesThatChangePriceXpath = ["kabum", "pichau"]

  detectStore (url: string): string | boolean {
    for(let store of this.supportedStores) {
      if (url.includes(store)) return store
    }
    return false
  }

  async startInfiniteScraping () {

  }

  //initial info gathering when the user inserts a new product
  async getManyProductsInfo (products: [string], userid: string): Promise<any> {
    //: Promise<[ProductType]>
    const productsWithStore = products.map((p) => {
      return { store: this.detectStore(p), url: p }
    })
    const cluster: Cluster = await Cluster.launch({
      puppeteer,
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 1,
      puppeteerOptions: {
        //@ts-ignore
        headless: true,
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
    for(const prod of productsWithStore) {
      cluster.queue({prod, userid}, async ({page, data}: PuppeteerClusterParams): Promise<any> => {
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
        const formattedPrice = this.formatPriceToFloat(notFormattedPrice)
        fullProduct.price = formattedPrice
        console.log(fullProduct)
      })
    }

    await cluster.idle();
    await cluster.close();
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
    const imgUrlXpath: string = config.imageElement[store as 'kabum' | 'terabyte' | 'pichau']
    await page.waitForXPath(imgUrlXpath)
    const imgUrlElement = await page.$x(imgUrlXpath)
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

  formatPriceToFloat(price: string): number {
    return accounting.unformat(price,",")
  }

  async saveProductsInDatabase(products:[ProductType]) {

  }
}
