import vanillaPuppeteer from 'puppeteer'
import { Cluster } from 'puppeteer-cluster'

export default new class ScrapingService {
  supportedStores = ["kabum", "pichau", "terabyte"]

  detectStore (url: string) {
    for(let store of this.supportedStores) {
      if (url.includes(store)) return store
      return false
    }
  }

  async startInfiniteScraping () {

  }

  async getManyProductsInfo (products: [String]) {
    
  }
}