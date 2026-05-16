export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: 'CryptoTracker — Live Cryptocurrency Prices',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track live cryptocurrency prices, market cap, and 24h changes.' }
      ]
    }
  }
})
