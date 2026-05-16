<template>
  <div class="container">
    <header>
      <h1>CryptoTracker</h1>
      <p>Live cryptocurrency prices via CoinGecko</p>
    </header>
    <div class="controls">
      <input v-model="search" placeholder="Search by name or symbol..." class="search-input" />
      <span class="refresh-note">Auto-refresh every 60s</span>
    </div>
    <table v-if="filteredCoins.length" class="crypto-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price (USD)</th>
          <th>24h Change</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coin, idx) in filteredCoins" :key="coin.id">
          <td>{{ idx + 1 }}</td>
          <td class="coin-name">
            <img :src="coin.image" :alt="coin.name" class="coin-icon" />
            <span class="coin-symbol">{{ coin.symbol.toUpperCase() }}</span>
            <span class="coin-full-name">{{ coin.name }}</span>
          </td>
          <td>${{ formatPrice(coin.current_price) }}</td>
          <td :class="coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'">
            {{ formatPercent(coin.price_change_percentage_24h) }}
          </td>
          <td>${{ formatLarge(coin.market_cap) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="loading" class="loading">Loading cryptocurrency data...</div>
    <div v-else class="loading">No cryptocurrencies found.</div>
  </div>
</template>

<script setup>
const search = ref('')
const coins = ref([])
const loading = ref(true)

async function fetchCoins() {
  try {
    const res = await $fetch('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false
      }
    })
    coins.value = res
  } catch (e) {
    console.error('Failed to fetch coins:', e)
  } finally {
    loading.value = false
  }
}

const filteredCoins = computed(() => {
  if (!search.value) return coins.value
  const q = search.value.toLowerCase()
  return coins.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  )
})

function formatPrice(v) {
  if (!v) return '0.00'
  return v < 0.01 ? v.toPrecision(4) : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatPercent(v) {
  if (v == null) return '—'
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}

function formatLarge(v) {
  if (!v) return '—'
  if (v >= 1e12) return (v / 1e12).toFixed(2) + 'T'
  if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B'
  if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M'
  return v.toLocaleString()
}

onMounted(() => {
  fetchCoins()
  setInterval(fetchCoins, 60000)
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; }
.container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
header { text-align: center; margin-bottom: 2rem; }
header h1 { font-size: 2.5rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
header p { color: #94a3b8; margin-top: 0.5rem; }
.controls { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 250px; padding: 0.75rem 1rem; border: 1px solid #334155; border-radius: 8px; background: #1e293b; color: #e2e8f0; font-size: 1rem; outline: none; }
.search-input:focus { border-color: #3b82f6; }
.refresh-note { color: #64748b; font-size: 0.85rem; }
.crypto-table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; }
.crypto-table th { text-align: left; padding: 1rem; background: #0f172a; color: #94a3b8; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
.crypto-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #334155; }
.crypto-table tr:hover { background: #334155; }
.coin-name { display: flex; align-items: center; gap: 0.5rem; }
.coin-icon { width: 24px; height: 24px; border-radius: 50%; }
.coin-symbol { font-weight: 600; }
.coin-full-name { color: #94a3b8; font-size: 0.85rem; }
.positive { color: #22c55e; font-weight: 600; }
.negative { color: #ef4444; font-weight: 600; }
.loading { text-align: center; padding: 3rem; color: #64748b; font-size: 1.1rem; }
</style>
