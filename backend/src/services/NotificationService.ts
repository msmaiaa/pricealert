import { ProductType } from "../repositories/ProductsRepository";
import DiscordNotificationService from "./DiscordNotificationService";
import ProductService from "./ProductService";

interface IUser{
  username: string,
  email: string,
  sendDiscordNotifications: string,
  notifyIfPriceGoesHigher: string,
  notifyIfPriceGoesLower: string,
  notifyIfProductIsOOS: string,
  discordHookUrl: string,
  password?: string,
  created: Date,
}

export default new class NotificationService {
  async handlePrices(product: ProductType, newPrice: number, change: string) {
    const usersOfProduct: Array<IUser> = await ProductService.getUsersFromProduct(product)
    for(const user of usersOfProduct) {
      if(!user.sendDiscordNotifications && !user.discordHookUrl) return
      let notificationMessage = ''
      if(user.notifyIfPriceGoesHigher && change === "priceHigher") {
        notificationMessage = 'preço aumentou'
      }
      if(user.notifyIfPriceGoesLower && change === "priceLower") {
        notificationMessage = 'preço abaixo'
      }
      if(user.notifyIfProductIsOOS && change === "outOfStock") {
        notificationMessage = 'produto fora de estoque'
      }
      await DiscordNotificationService.send({ product, message: notificationMessage, webhookUrl: user.discordHookUrl, newPrice})
      console.log('Sending notification to user:', user.username)
    }
  }
}