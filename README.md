# Stellar Price Oracle Intelligence Layer

A comprehensive price oracle system for the Stellar network built with Soroban smart contracts, providing real-time price feeds from multiple sources including AMM pools, orderbooks, and external oracles.

## 🚀 Features

- **Multi-Source Price Aggregation**: Combines data from AMM pools, orderbooks, and external oracles
- **Real-Time Data Feeds**: Automated data fetching and contract updates
- **High Confidence Scoring**: Confidence metrics based on liquidity and data quality
- **Soroban Smart Contracts**: Native Stellar blockchain integration
- **Web Interface**: Interactive price monitoring and management dashboard
- **Configurable Assets**: Support for XLM, USDC, USDT, AQUA, yXLM, MOBI and more

## 📁 Project Structure

```
stellar/
├── contracts/
│   └── comprehensive-oracle/     # Soroban smart contract
├── oracle-data-feeder.js         # Data fetching and contract updates
├── price-oracle-client.js        # Client for interacting with oracle
├── real-data-integration.js      # Real-time data integration
├── stellar-pricer.html          # Web interface
├── stellar-pricer-english.html  # English version of web interface
├── stellar.tsx                  # React components
├── stellar_price_oracle.rs      # Core oracle contract
├── comprehensive_price_oracle.rs # Enhanced oracle contract
└── deploy-comprehensive.sh      # Deployment script
```

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- Soroban CLI
- Stellar account with XLM for transactions

### Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:Nefture/Intelligence-Layer.git
   cd Intelligence-Layer
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install @stellar/stellar-sdk
   ```

3. **Build Soroban contracts**
   ```bash
   cd contracts/comprehensive-oracle
   cargo build --target wasm32-unknown-unknown --release
   ```

4. **Configure environment variables**
   ```bash
   export STELLAR_NETWORK=testnet  # or mainnet
   export CONTRACT_ID=your_contract_id
   export ADMIN_SECRET_KEY=your_admin_secret_key
   export UPDATE_INTERVAL=300  # seconds
   ```

## 🚀 Quick Start

### 1. Deploy the Oracle Contract

```bash
./deploy-comprehensive.sh
```

### 2. Start the Data Feeder

```bash
node oracle-data-feeder.js
```

### 3. Access the Web Interface

Open `stellar-pricer.html` in your browser to view real-time price data and manage the oracle.

## 📊 Usage

### Data Feeder

The oracle data feeder automatically:
- Fetches pool data from Stellar DEX
- Retrieves orderbook information
- Updates contract with fresh price data
- Maintains confidence scores based on liquidity

```javascript
// Start the feeder
const feeder = new StellarDataFeeder();
feeder.start();
```

### Smart Contract Interaction

```rust
// Get price for an asset
let price = env.storage().instance().get(&DataKey::TokenPrices)
    .unwrap()
    .get(&asset_key)
    .unwrap();

// Update price data
env.storage().instance().set(&DataKey::TokenPrices, &prices);
```

### Web Interface

The web interface provides:
- Real-time price monitoring
- Asset management
- Oracle configuration
- Historical data visualization

## 🔧 Configuration

### Tracked Assets

The system tracks these assets by default:
- **XLM**: Native Stellar Lumens
- **USDC**: USD Coin
- **USDT**: Tether USD
- **AQUA**: Aquarius token
- **yXLM**: Yield-bearing XLM
- **MOBI**: Mobius token

### Network Configuration

- **Testnet**: `https://horizon-testnet.stellar.org`
- **Mainnet**: `https://horizon.stellar.org`

### Update Intervals

- Default: 5 minutes (300 seconds)
- Configurable via `UPDATE_INTERVAL` environment variable

## 🏗️ Architecture

### Smart Contract Components

1. **TokenPrice**: Core price data structure
2. **PoolReserves**: AMM pool information
3. **OrderbookLevel**: Orderbook price levels
4. **DataKey**: Storage key enumeration

### Data Flow

1. **Data Collection**: Feeder fetches from Stellar DEX
2. **Processing**: Aggregates and validates price data
3. **Storage**: Updates Soroban contract storage
4. **Access**: Web interface and clients read data

### Price Calculation

Prices are calculated using:
- AMM pool reserves and ratios
- Orderbook bid/ask spreads
- External oracle feeds
- Confidence scoring based on liquidity

## 🔒 Security

- Admin-only contract updates
- Confidence-based price validation
- Multi-source data verification
- Configurable update intervals

## 📈 Monitoring

The system provides:
- Real-time price feeds
- Confidence metrics
- Liquidity tracking
- Update timestamps
- Source attribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🔄 Updates

The oracle automatically updates every 5 minutes with fresh data from:
- Stellar DEX AMM pools
- Orderbook data
- External price feeds

---

**Note**: This is a production-ready price oracle system designed for the Stellar network. Always test on testnet before deploying to mainnet.
