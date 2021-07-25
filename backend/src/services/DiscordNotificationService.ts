import webhook from 'webhook-discord'
import { ProductType } from '../repositories/ProductsRepository'

interface IParams {
  product: ProductType
  message: string
  webhookUrl: string
  newPrice: number
}

const avatarUrl = 'https://e7.pngegg.com/pngimages/279/137/png-clipart-gabe-newell-gaben-smile-memes-gaben.png';
const webhookColor = '#357097'
const webhookName = 'Price alert'

export default new class DiscordNotificationService {
  async send({ product, message, webhookUrl, newPrice}: IParams) {
    try{
      const webhookClient = new webhook.Webhook(webhookUrl)
      const webhookMessage = new webhook.MessageBuilder()
      .setTitle(`${product.name}`)
      .setAvatar(avatarUrl)
      .setName(webhookName)
      .setColor(webhookColor)
      .setImage(product.imgUrl)
      .addField('Loja:', product.store)
      .addField('Status:', message)
      .setURL(product.url)
      .addField('Preço novo:', 'R$' + newPrice.toString())
      .addField('Preço antigo:', 'R$' + product.price.toString())

      webhookClient.send(webhookMessage)
      return 
    }catch(e) {
      console.error(e)
    }
  }
}