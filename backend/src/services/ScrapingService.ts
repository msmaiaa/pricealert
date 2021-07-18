import vanillaPuppeteer from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'
import { ProductType } from '../repositories/ProductsRepository'
import { addExtra } from "puppeteer-extra"
import Stealth from "puppeteer-extra-plugin-stealth"
import * as config from '../config/ScrapeConfigs.json'
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

  detectStore (url: string): string | boolean {
    for(let store of this.supportedStores) {
      if (url.includes(store)) return store
    }
    return false
  }

  async startInfiniteScraping () {

  }

  //initial info gather when the user inserts a new product
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
        headless: false,
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
        // fullProduct.price = await this.getProductPrice(fullProduct.store, page)
        console.log(fullProduct)
      })
    }

    await cluster.idle();
    await cluster.close();
  }

  async getProductName(store: string, page: vanillaPuppeteer.Page): Promise<string> {
    const titleXpath: string = config.titleElement[store as 'kabum' | 'terabyte' | 'pichau'] 
    await page.waitForXPath(titleXpath)
    const titleElement = await page.$x(titleXpath)
    const title = await page.evaluate(el => el.textContent, titleElement[0])
    return Promise.resolve(title)
  }

  async getProductPrice(store: any, page: vanillaPuppeteer.Page): Promise<number> {
    return Promise.resolve(1)
  }

  async getProductImage(store: any, page: vanillaPuppeteer.Page): Promise<string> {
    const imgUrlXpath: string = config.imageElement[store as 'kabum' | 'terabyte' | 'pichau']
    await page.waitForXPath(imgUrlXpath)
    const imgUrlElement = await page.$x(imgUrlXpath)
    const imgUrl = await page.evaluate(el => el.getAttribute('src'), imgUrlElement[0])
    return Promise.resolve(imgUrl)
  }

  async saveProductsInDatabase(products:[ProductType]) {

  }
}
