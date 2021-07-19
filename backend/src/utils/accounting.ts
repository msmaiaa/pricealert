import accounting from 'accounting-js' 


export default new class Accounting {
  formatPriceToFloat(price: string): number {
    return accounting.unformat(price,",")
  }
}