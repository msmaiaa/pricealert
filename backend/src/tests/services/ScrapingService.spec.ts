import ScrapingService from '../../services/ScrapingService'

const makeMocks = () => {
  const mockStoreUrls = [
    {
      name: "kabum",
      url: "https://www.kabum.com.br/produto/128561/console-microsoft-xbox-series-s-512gb-branco-r-"
    },
    {
      name: "pichau",
      url: "https://www.pichau.com.br/headset-gamer-corsair-void-rgb-elite-wireless-carbon-7-1-drivers-50mm-ca-9011201"
    },
    {
      name: "terabyte",
      url: "https://www.terabyteshop.com.br/produto/16962/t-moba-viper-lvl-3"
    }
  ]

  return {
    mockStoreUrls,
  }
}

const makeSut = () => {
  return ScrapingService
}

describe('ScrapingService', () => {
  test('detectStore should return the correct values', () => {
    const sut = makeSut()
    const mockedStores = makeMocks().mockStoreUrls
    for(const mockedStore of mockedStores) {
      const foundStoreName = sut.detectStore(mockedStore.url)
      expect(foundStoreName).toEqual(mockedStore.name)
    }
  });
});