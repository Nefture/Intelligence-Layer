import React, { useState, useEffect } from 'react'
import { 
  Search, 
  TrendingUp, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Moon,
  Sun,
  BarChart3,
  Activity,
  Shield,
  Zap,
  Globe,
  Clock
} from 'lucide-react'
import SyncroneLogo from './components/SyncroneLogo'

function App() {
  const [tokenAddress, setTokenAddress] = useState('')
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [callHistory, setCallHistory] = useState([])
  const [contractCallHistory, setContractCallHistory] = useState([])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Get real price data from the API
  const getRealPrice = async (assetInput) => {
    setLoading(true)
    setError(null)
    
    const callStartTime = Date.now()
    
    try {
      console.log(`🔍 Fetching real price for ${assetInput} from API...`)
      
      // Add call to history
      const newCall = {
        id: Date.now(),
        asset: assetInput,
        timestamp: new Date().toISOString(),
        status: 'calling',
        endpoint: `http://localhost:3001/api/price/${assetInput}`,
        startTime: callStartTime
      }
      setCallHistory(prev => [newCall, ...prev.slice(0, 9)]) // Keep last 10 calls
      
      // Call the real API server
      const response = await fetch(`http://localhost:3001/api/price/${assetInput}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const apiData = await response.json()
      console.log(`✅ Got real price data for ${assetInput}:`, apiData)
      
      // Update call history with success
      setCallHistory(prev => prev.map(call => 
        call.id === newCall.id 
          ? {
              ...call,
              status: 'success',
              endTime: Date.now(),
              duration: Date.now() - callStartTime,
              price: apiData.price,
              source: apiData.source,
              contractValidated: apiData.contractValidation?.validated
            }
          : call
      ))
      
      // Add smart contract call to history
      if (apiData.contractValidation?.validated) {
        const contractCall = {
          id: Date.now() + 1,
          asset: assetInput,
          timestamp: new Date().toISOString(),
          contractId: 'CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL',
          method: 'get_price',
          network: 'testnet',
          realTimePrice: apiData.price,
          contractPrice: apiData.contractValidation.contractPrice,
          validationStatus: apiData.contractValidation.validationStatus,
          deviation: Math.abs(apiData.price - apiData.contractValidation.contractPrice) / apiData.price * 100
        }
        setContractCallHistory(prev => [contractCall, ...prev.slice(0, 9)]) // Keep last 10 calls
      }
      
      // Convert API response to frontend format
      const sources = apiData.source ? [{
        source: apiData.source,
        price: apiData.price,
        volume: apiData.volume || 0
      }] : []
      
      setPriceData({
        asset: assetInput,
        price: apiData.price,
        weightedPrice: apiData.price,
        sources,
        timestamp: new Date().toISOString(),
        confidence: apiData.confidence,
        volume: apiData.volume,
        liquidity: apiData.liquidity,
        lastUpdate: apiData.lastUpdate,
        spread: apiData.spread,
        bestBid: apiData.bestBid,
        bestAsk: apiData.bestAsk,
        contractValidation: apiData.contractValidation
      })
      
    } catch (err) {
      console.error('Error fetching real price:', err)
      setError(`Failed to fetch price: ${err.message}`)
      
      // Update call history with error
      setCallHistory(prev => prev.map(call => 
        call.id === newCall.id 
          ? {
              ...call,
              status: 'error',
              endTime: Date.now(),
              duration: Date.now() - callStartTime,
              error: err.message
            }
          : call
      ))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (tokenAddress.trim()) {
      getRealPrice(tokenAddress.trim())
    }
  }

  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    return price.toFixed(2)
  }

  const popularTokens = ['XLM', 'USDT', 'AQUA']

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <SyncroneLogo className="w-8 h-8" darkMode={darkMode} />
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <TrendingUp className={`w-5 h-5 ${
                    darkMode ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Stellar Pricer</h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>by Syncrone • Real-time price feeds</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className={`lg:col-span-1 card p-6`}>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Price Lookup</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className={`absolute left-3 top-3 w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Enter token symbol or address"
                      className="input-field pl-10"
                    />
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Analyzing...' : 'Get Price'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Access Tokens */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-500">Popular Tokens</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularTokens.map((token) => (
                    <button
                      key={token}
                      onClick={() => {
                        setTokenAddress(token)
                        getRealPrice(token)
                      }}
                      className="btn-secondary"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="lg:col-span-2 space-y-6">
            {priceData ? (
              <>
                {/* Main Price Card */}
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        darkMode ? 'bg-blue-600' : 'bg-blue-100'
                      }`}>
                        <span className="text-lg font-bold">
                          {priceData.asset.split(':')[0].substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {priceData.asset.split(':')[0]}
                        </h2>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {priceData.asset.includes(':') ? 'Custom Asset' : 'Native Asset'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => getRealPrice(tokenAddress)}
                      className={`p-2 rounded-lg transition-colors ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Current Price</p>
                      <p className="text-3xl font-bold text-green-500">
                        ${formatPrice(priceData.price)}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Best Bid</p>
                      <p className="text-xl font-semibold text-blue-500">
                        ${formatPrice(priceData.bestBid)}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Best Ask</p>
                      <p className="text-xl font-semibold text-red-500">
                        ${formatPrice(priceData.bestAsk)}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Spread</p>
                      <p className="text-lg font-medium text-orange-500">
                        {priceData.bestBid && priceData.bestAsk ? 
                          `${(((priceData.bestAsk - priceData.bestBid) / priceData.bestBid) * 100).toFixed(2)}%` : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Confidence</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {priceData.confidence ? `${priceData.confidence}%` : 'N/A'}
                      </p>
                      {priceData.contractValidation?.enhanced && (
                        <p className="text-xs text-green-500 mt-1">
                          ✨ Contract Enhanced
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Volume</p>
                      <p className="text-xl font-semibold">
                        {priceData.volume ? `$${formatPrice(priceData.volume)}` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Last Update</p>
                      <p className="text-sm font-medium">
                        {priceData.lastUpdate ? 
                          new Date(priceData.lastUpdate).toLocaleTimeString() : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Sources */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Price Sources</h3>
                  <div className="space-y-3">
                    {priceData.sources.map((source, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              source.source.includes('AMM') ? 'bg-blue-500' :
                              source.source.includes('ORDERBOOK') ? 'bg-green-500' :
                              'bg-purple-500'
                            }`} />
                            <span className="font-medium">{source.source}</span>
                          </div>
                          <span className="text-lg font-bold">
                            ${formatPrice(source.price)}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          {source.volume && source.volume > 0 && (
                            <span>Vol: {source.volume.toLocaleString()}</span>
                          )}
                          {source.liquidity && (
                            <span>Liq: {source.liquidity.toLocaleString()}</span>
                          )}
                          {source.route && (
                            <span>Route: {source.route}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Contract Validation Status */}
                    {priceData.contractValidation && (
                      <div className={`p-4 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              priceData.contractValidation.validated 
                                ? 'bg-green-500' 
                                : 'bg-yellow-500'
                            }`} />
                            <span className="font-medium">Soroban Contract</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              priceData.contractValidation.validationStatus === 'VALID' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : priceData.contractValidation.validationStatus === 'SUSP'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {priceData.contractValidation.validationStatus}
                            </span>
                          </div>
                          {priceData.contractValidation.contractPrice && (
                            <span className="text-lg font-bold">
                              ${formatPrice(priceData.contractValidation.contractPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Enhanced: {priceData.contractValidation.enhanced ? 'Yes' : 'No'}</span>
                          <span>Validated: {priceData.contractValidation.validated ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Syncrone Soroban Call History Section */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    Live Syncrone Soroban Call History
                  </h3>
                  
                  {/* Explanation */}
                  <div className={`p-4 rounded-lg mb-4 ${
                    darkMode 
                      ? 'bg-blue-900/20 border border-blue-800' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium mb-2">How It Works:</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Our system fetches <strong>real-time prices</strong> from Stellar DEX and validates them against our Soroban smart contract. 
                          When prices differ significantly, the contract flags them as <strong>"SUSP"</strong> (Suspicious).
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <strong>SUSP</strong> = Suspicious deviation detected (price difference &gt; 10%). This helps detect anomalies and ensures price accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {contractCallHistory.length === 0 ? (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No smart contract calls yet. Search for a token to see live Soroban contract invocations.
                      </p>
                    ) : (
                      contractCallHistory.map((call) => (
                        <div key={call.id} className={`p-4 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="font-medium">{call.asset}</span>
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                SUCCESS
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(call.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Contract ID:</span>
                              <div className="font-mono text-xs mt-1 break-all">
                                {call.contractId}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Method:</span>
                              <span className="ml-1 font-medium">{call.method}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Network:</span>
                              <span className="ml-1 font-medium">{call.network}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Deviation:</span>
                              <span className={`ml-1 font-medium ${
                                call.deviation > 10 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {call.deviation.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Real-time Price:</span>
                                <span className="ml-1 font-medium text-green-600">${call.realTimePrice?.toFixed(6)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Contract Price:</span>
                                <span className="ml-1 font-medium text-blue-600">${call.contractPrice?.toFixed(6)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-medium">Command executed:</span>
                            <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                              soroban contract invoke --id {call.contractId} --source-account admin --network {call.network} -- {call.method} --asset_code "{call.asset}"
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>


                {/* Contract Information */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">SC</span>
                    </div>
                    Soroban Smart Contract
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Contract Details */}
                    <div className={`p-4 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Contract Details</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          priceData.contractValidation?.validated 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {priceData.contractValidation?.validated ? 'ACTIVE' : 'STANDBY'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contract ID:</span>
                          <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Network:</span>
                          <span className="font-medium">Stellar Testnet</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">Price Oracle & Validator</span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Validation Status */}
                    {priceData.contractValidation && (
                      <div className={`p-4 rounded-xl border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <h4 className="font-semibold mb-3">Validation Status</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                priceData.contractValidation.validationStatus === 'VALID' 
                                  ? 'bg-green-500' 
                                  : priceData.contractValidation.validationStatus === 'SUSP'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`} />
                              <span className="font-medium">
                                {priceData.contractValidation.validationStatus}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Contract Price</p>
                            <p className="font-semibold">
                              {priceData.contractValidation.contractPrice ? 
                                `$${formatPrice(priceData.contractValidation.contractPrice)}` : 
                                'N/A'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {priceData.contractValidation.deviation && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-500 mb-1">Price Deviation</p>
                            <p className={`font-semibold ${
                              priceData.contractValidation.deviation > 10 
                                ? 'text-red-500' 
                                : 'text-green-500'
                            }`}>
                              {priceData.contractValidation.deviation.toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contract Links */}
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="https://stellar.expert/explorer/testnet/contract/CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Globe className="w-4 h-4" />
                        <span>View on Explorer</span>
                      </a>
                      
                      <a 
                        href="https://stellar.expert/explorer/testnet/contract/CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL/operations"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>View Contract Operations</span>
                      </a>
                    </div>

                    {/* How Contract Works */}
                    <div className={`p-4 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className="font-semibold mb-3">How It Works</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>• <strong>Real-time Data:</strong> Fetches live prices from Stellar DEX</p>
                        <p>• <strong>Contract Validation:</strong> Compares with stored contract prices</p>
                        <p>• <strong>Anomaly Detection:</strong> Flags suspicious price movements</p>
                        <p>• <strong>Enhanced Confidence:</strong> Blends multiple data sources</p>
                        <p>• <strong>Transparent Reporting:</strong> Shows validation status and deviation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="card p-12 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <BarChart3 className={`w-8 h-8 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Price Data</h3>
                <p className={`${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Enter a token symbol or address to view real-time pricing data
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className={`${
                darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
              } border rounded-2xl p-4`}>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              darkMode ? 'bg-blue-600' : 'bg-blue-100'
            }`}>
              <Activity className={`w-6 h-6 ${
                darkMode ? 'text-white' : 'text-blue-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Live price feeds from Stellar DEX with sub-second updates
            </p>
          </div>

          <div className="card p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              darkMode ? 'bg-green-600' : 'bg-green-100'
            }`}>
              <Shield className={`w-6 h-6 ${
                darkMode ? 'text-white' : 'text-green-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-source</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Aggregated from AMM pools, orderbooks, and external feeds
            </p>
          </div>

          <div className="card p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              darkMode ? 'bg-purple-600' : 'bg-purple-100'
            }`}>
              <Zap className={`w-6 h-6 ${
                darkMode ? 'text-white' : 'text-purple-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">DeFi Ready</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Perfect for liquidation bots, yield farming, and protocols
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${
        darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SyncroneLogo className="w-6 h-6" darkMode={darkMode} />
              <span className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Stellar Pricer by Syncrone
              </span>
            </div>
            <div className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Powered by Stellar Network • Real-time blockchain data
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
