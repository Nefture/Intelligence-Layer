const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const { Horizon, Asset } = require('@stellar/stellar-sdk');
const app = express();
const port = 3001;

// Real Stellar DEX integration - NO HARDCODED VALUES
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

const ASSETS = {
  XLM: Asset.native(),
  USDC: new Asset('USDC', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'),
  USDT: new Asset('USDT', 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V'),
  AQUA: new Asset('AQUA', 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA')
};

// Get REAL price from Stellar DEX - NO HARDCODED VALUES
async function getRealStellarPrice(assetCode) {
  try {
    console.log(`🔍 Fetching REAL price for ${assetCode} from Stellar DEX...`);
    
    const asset = ASSETS[assetCode.toUpperCase()];
    if (!asset) {
      throw new Error(`Asset ${assetCode} not supported`);
    }

    let realPriceData = null;

    // Try to get real orderbook data first
    try {
      // Try USDC pair first, then XLM pair if USDC fails
      let orderbook = null;
      try {
        orderbook = await server.orderbook(asset, ASSETS.USDC)
          .limit(20)
          .call();
      } catch (usdcError) {
        console.log(`No USDC pair for ${assetCode}, trying XLM pair...`);
        if (assetCode !== 'XLM') {
          orderbook = await server.orderbook(asset, ASSETS.XLM)
            .limit(20)
            .call();
        }
      }

      if (orderbook.bids.length && orderbook.asks.length) {
        // Calculate real mid price
        const bestBid = parseFloat(orderbook.bids[0].price);
        const bestAsk = parseFloat(orderbook.asks[0].price);
        const midPrice = (bestBid + bestAsk) / 2;

        // Calculate real volume
        const bidVolume = orderbook.bids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0);
        const askVolume = orderbook.asks.reduce((sum, ask) => sum + parseFloat(ask.amount), 0);
        const totalVolume = bidVolume + askVolume;

        // Calculate real spread
        const spread = ((bestAsk - bestBid) / bestBid * 100);

        realPriceData = {
          price: midPrice,
          source: 'STELLAR_DEX_ORDERBOOK',
          volume: totalVolume,
          spread: spread,
          confidence: Math.max(60, Math.min(95, 100 - spread)),
          lastUpdate: Date.now(),
          bestBid,
          bestAsk
        };

        console.log(`✅ REAL orderbook data for ${assetCode}:`, realPriceData);
      }
    } catch (orderbookError) {
      console.log(`No orderbook data for ${assetCode}, trying AMM pools...`);
    }

    // If no orderbook data, try AMM pools
    if (!realPriceData) {
      try {
        const pools = await server.liquidityPools()
          .forAssets([asset])
          .limit(10)
          .call();
        
        if (pools.records.length > 0) {
          const pool = pools.records[0];
          const reserves = pool.reserves;
          
          // Calculate AMM price from reserves
          let assetReserve = 0;
          let usdcReserve = 0;
          
          for (const reserve of reserves) {
            if (reserve.asset === assetCode || (assetCode === 'XLM' && reserve.asset === 'native')) {
              assetReserve = parseFloat(reserve.amount);
            } else if (reserve.asset.includes('USDC')) {
              usdcReserve = parseFloat(reserve.amount);
            }
          }

          if (assetReserve > 0 && usdcReserve > 0) {
            const ammPrice = usdcReserve / assetReserve;
            const liquidity = parseFloat(pool.total_shares || 0);

            realPriceData = {
              price: ammPrice,
              source: 'STELLAR_DEX_AMM',
              volume: liquidity,
              liquidity: liquidity,
              confidence: 75, // AMM confidence
              lastUpdate: Date.now(),
              poolId: pool.id
            };

            console.log(`✅ REAL AMM data for ${assetCode}:`, realPriceData);
          }
        }
      } catch (ammError) {
        console.log(`No AMM pools for ${assetCode}`);
      }
    }

    // If still no real data, try mainnet for reference prices
    if (!realPriceData) {
      try {
        console.log(`Trying mainnet for reference price for ${assetCode}...`);
        const mainnetServer = new Horizon.Server('https://horizon.stellar.org');
        
        let orderbook = null;
        try {
          orderbook = await mainnetServer.orderbook(asset, ASSETS.USDC)
            .limit(5)
            .call();
        } catch (usdcError) {
          console.log(`No mainnet USDC pair for ${assetCode}, trying XLM pair...`);
          if (assetCode !== 'XLM') {
            orderbook = await mainnetServer.orderbook(asset, ASSETS.XLM)
              .limit(5)
              .call();
          }
        }

        if (orderbook.bids.length && orderbook.asks.length) {
          const bestBid = parseFloat(orderbook.bids[0].price);
          const bestAsk = parseFloat(orderbook.asks[0].price);
          const midPrice = (bestBid + bestAsk) / 2;

          realPriceData = {
            price: midPrice,
            source: 'STELLAR_MAINNET_REFERENCE',
            volume: 0,
            confidence: 70, // Lower confidence for mainnet reference
            lastUpdate: Date.now(),
            bestBid,
            bestAsk,
            note: 'Mainnet reference price - testnet may differ'
          };

          console.log(`✅ MAINNET reference price for ${assetCode}:`, realPriceData);
        }
      } catch (mainnetError) {
        console.log(`No mainnet data available for ${assetCode}`);
      }
    }


    // If still no data, try external price APIs for real market data
    if (!realPriceData) {
      try {
        console.log(`Trying external price API for ${assetCode}...`);
        
        if (assetCode === 'USDC') {
          // Get real USDC price from CoinGecko API
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd&include_24hr_change=true');
          const data = await response.json();
          
          if (data['usd-coin'] && data['usd-coin'].usd) {
            realPriceData = {
              price: data['usd-coin'].usd,
              source: 'COINGECKO_API',
              volume: 0,
              confidence: 85,
              lastUpdate: Date.now(),
              change24h: data['usd-coin'].usd_24h_change,
              note: 'Real-time price from CoinGecko API'
            };
            console.log(`✅ EXTERNAL API price for ${assetCode}:`, realPriceData);
          }
        }
      } catch (externalError) {
        console.log(`External API failed for ${assetCode}:`, externalError.message);
      }
    }

    if (!realPriceData) {
      throw new Error(`No real price data available for ${assetCode} on Stellar network`);
    }

    return realPriceData;

  } catch (error) {
    console.error(`❌ Error fetching real price for ${assetCode}:`, error);
    throw error;
  }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Get REAL price from Stellar DEX - NO HARDCODED VALUES
app.get('/api/price/:assetCode', async (req, res) => {
    const { assetCode } = req.params;
    
    try {
        console.log(`🔍 Getting REAL price for ${assetCode} from Stellar DEX...`);
        
        // Get REAL data from Stellar DEX
        const realPriceData = await getRealStellarPrice(assetCode);
        
        // Validate with Soroban contract
        const contractValidation = await validatePriceWithContract(assetCode, realPriceData);
        
        // Calculate enhanced confidence
        let enhancedConfidence = realPriceData.confidence;
        if (contractValidation.validated) {
            // Blend confidence scores
            enhancedConfidence = Math.round((realPriceData.confidence + contractValidation.confidence) / 2);
        }
        
        // Convert to frontend format with contract validation
        const result = {
            price: realPriceData.price,
            source: realPriceData.source,
            volume: realPriceData.volume,
            liquidity: realPriceData.liquidity,
            confidence: enhancedConfidence,
            lastUpdate: realPriceData.lastUpdate,
            spread: realPriceData.spread,
            bestBid: realPriceData.bestBid,
            bestAsk: realPriceData.bestAsk,
            // Contract validation data
            contractValidation: {
                validated: contractValidation.validated,
                contractPrice: contractValidation.contractPrice,
                validationStatus: contractValidation.validationStatus,
                enhanced: true
            }
        };
        
        console.log(`✅ REAL price data for ${assetCode}:`, result);
        res.json(result);
        
    } catch (error) {
        console.error(`❌ Error getting REAL price for ${assetCode}:`, error);
        res.status(500).json({ 
            error: `Failed to get real price for ${assetCode}: ${error.message}` 
        });
    }
});

// Validate price with Soroban contract - NEW FUNCTION
async function validatePriceWithContract(assetCode, realTimeData) {
    try {
        console.log(`🔍 Validating ${assetCode} price with Soroban contract...`);
        
        // Convert price to 7-decimal format for contract
        const priceIn7Decimals = Math.round(realTimeData.price * 10_000_000);
        
        // Call existing contract method to get contract price
        const command = `soroban contract invoke --id CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL --source-account admin --network testnet -- get_price --asset_code "${assetCode}"`;
        
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`⚠️ Contract validation failed for ${assetCode}, using real-time data only`);
                    resolve({
                        validated: false,
                        contractPrice: null,
                        validationStatus: 'CONTRACT_ERROR',
                        confidence: realTimeData.confidence
                    });
                    return;
                }
                
                try {
                    const lines = stdout.trim().split('\n');
                    const dataLine = lines[lines.length - 1];
                    
                    if (dataLine && dataLine.includes('price_usd')) {
                        // Parse contract response
                        const contractData = JSON.parse(dataLine);
                        console.log(`✅ Contract price for ${assetCode}:`, contractData);
                        
                        // Calculate price deviation between real-time and contract
                        const contractPrice = contractData.price_usd / 10_000_000;
                        const priceDiff = Math.abs(realTimeData.price - contractPrice);
                        const deviationPercent = (priceDiff / realTimeData.price) * 100;
                        
                        let validationStatus = 'VALID';
                        if (deviationPercent > 10) {
                            validationStatus = 'SUSP';
                        }
                        
                        resolve({
                            validated: true,
                            contractPrice: contractPrice,
                            validationStatus: validationStatus,
                            confidence: contractData.confidence,
                            sources: contractData.sources,
                            deviation: deviationPercent
                        });
                    } else {
                        resolve({
                            validated: false,
                            contractPrice: null,
                            validationStatus: 'NO_CONTRACT_DATA',
                            confidence: realTimeData.confidence
                        });
                    }
                } catch (parseError) {
                    console.log(`⚠️ Could not parse contract response for ${assetCode}`);
                    resolve({
                        validated: false,
                        contractPrice: null,
                        validationStatus: 'PARSE_ERROR',
                        confidence: realTimeData.confidence
                    });
                }
            });
        });
        
    } catch (error) {
        console.error(`❌ Contract validation error for ${assetCode}:`, error);
        return {
            validated: false,
            contractPrice: null,
            validationStatus: 'ERROR',
            confidence: realTimeData.confidence
        };
    }
}

// Get all prices
app.get('/api/prices', (req, res) => {
    console.log('🔍 Getting all prices from contract...');
    
    const command = `soroban contract invoke --id CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL --source-account admin --network testnet -- get_all_prices`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        
        try {
            const lines = stdout.trim().split('\n');
            const dataLine = lines[lines.length - 1];
            
            if (dataLine && dataLine.startsWith('{')) {
                const allPrices = JSON.parse(dataLine);
                console.log('✅ Got all prices:', allPrices);
                res.json(allPrices);
            } else {
                res.status(404).json({ error: 'No price data available' });
            }
        } catch (parseError) {
            console.error('Parse error:', parseError);
            res.status(500).json({ error: 'Failed to parse contract response' });
        }
    });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 API server running at http://localhost:${port}`);
    console.log(`📊 Contract: CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL`);
    console.log(`🌐 React app served at http://localhost:${port}`);
});
