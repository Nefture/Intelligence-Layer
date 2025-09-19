# Stellar Pricer by Syncrone

A modern, real-time price oracle application for the Stellar network. Built with React and integrated with Soroban smart contracts for accurate price validation and anomaly detection.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Launch

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Access the app:**
   Open your browser and navigate to `http://localhost:3001`

The application will automatically:
- Start the API server on port 3001
- Serve the React frontend
- Connect to Stellar testnet for real-time price data
- Validate prices using our Soroban smart contract

## 🎯 What is Stellar Pricer?

Stellar Pricer is a comprehensive price oracle solution that provides real-time pricing data for Stellar network assets. It combines multiple data sources to ensure accuracy and includes smart contract validation for enhanced reliability.

### Key Features

- **Real-time Price Data**: Live prices from Stellar DEX, AMM pools, and mainnet reference
- **Smart Contract Validation**: Soroban contract integration for price validation and anomaly detection
- **Multi-source Aggregation**: Combines orderbook data, AMM pools, and external references
- **Modern UI**: Clean, responsive React interface with dark/light mode
- **Live Call History**: Real-time tracking of smart contract interactions
- **Confidence Scoring**: Quality metrics based on liquidity and data freshness

### Supported Assets

- **XLM**: Stellar Lumens (native)
- **USDT**: Tether USD
- **AQUA**: Aquarius token
- **Custom Assets**: Any Stellar asset with available liquidity

## 🏗️ Architecture

### Frontend (React)
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons
- **Real-time Updates**: Live price feeds with automatic refresh
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: User preference support

### Backend (Node.js/Express)
- **API Server**: Express.js server providing price data endpoints
- **Stellar Integration**: Direct connection to Stellar Horizon API
- **Multi-source Data**: Aggregates data from DEX, AMM pools, and mainnet
- **Smart Contract Integration**: Validates prices using deployed Soroban contract

### Smart Contract (Soroban)
- **Price Validation**: Validates real-time prices against stored contract data
- **Anomaly Detection**: Flags suspicious price deviations (>10%)
- **Confidence Scoring**: Provides quality metrics for price data
- **Contract ID**: `CDPOL5Q6Y62OXKNZKDDOGIEHBV6P5DXMEHTXCE5NTVT5KKPPXSUZDKOL`

## 📊 How It Works

1. **Data Collection**: The system fetches real-time prices from multiple Stellar sources
2. **Price Aggregation**: Combines data from orderbooks, AMM pools, and mainnet reference
3. **Smart Contract Validation**: Validates prices against our deployed Soroban contract
4. **Anomaly Detection**: Flags prices with significant deviations as "SUSP" (Suspicious)
5. **Confidence Scoring**: Provides quality metrics based on liquidity and data freshness
6. **Live Display**: Updates the frontend with validated price data and call history

## 🔧 Technical Details

### Price Sources
- **Stellar DEX Orderbook**: Bid/ask spreads from decentralized exchange
- **AMM Pools**: Liquidity pool reserves and pricing
- **Mainnet Reference**: Fallback pricing from Stellar mainnet
- **External APIs**: CoinGecko integration for additional price validation

### Smart Contract Features
- **Price Storage**: Stores validated prices with timestamps
- **Deviation Detection**: Calculates price differences and flags anomalies
- **Confidence Metrics**: Provides quality scores for price data
- **Multi-source Validation**: Aggregates data from multiple sources

### API Endpoints
- `GET /api/price/:assetCode` - Get real-time price for specific asset
- `GET /` - Serve React frontend application

## 🎨 UI Features

- **Price Display**: Real-time prices with source indicators
- **Detailed Metrics**: Bid/ask spreads, volume, confidence scores
- **Contract Information**: Smart contract details and validation status
- **Live Call History**: Real-time tracking of contract interactions
- **Explorer Links**: Direct links to Stellar Explorer for contract details
- **Responsive Design**: Optimized for all screen sizes

## 🔍 Monitoring & Validation

The application provides comprehensive monitoring capabilities:

- **Real-time Price Updates**: Live price feeds with automatic refresh
- **Contract Validation Status**: Shows whether prices are validated by smart contract
- **Deviation Tracking**: Monitors price differences between sources
- **Call History**: Logs all smart contract interactions with timestamps
- **Confidence Indicators**: Visual indicators for data quality

## 🛠️ Development

### Project Structure
```
stellar/
├── src/                    # React frontend
│   ├── App.jsx            # Main application component
│   ├── components/        # Reusable components
│   └── main.jsx           # React entry point
├── public/                # Static assets
├── api-server.js          # Express API server
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### Available Scripts
- `npm start` - Start the full application (API + frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production

### Environment Configuration
The application automatically configures for Stellar testnet. For mainnet deployment, update the network settings in `api-server.js`.

## 📈 Future Enhancements

- **Additional Assets**: Support for more Stellar tokens
- **Historical Data**: Price history and charting capabilities
- **Alerts**: Price change notifications
- **API Documentation**: Comprehensive API documentation
- **Mobile App**: Native mobile application

## 🤝 Contributing

This is a Syncrone project. For contributions or questions, please contact the development team.

## 📄 License

Proprietary software by Syncrone. All rights reserved.

---

**Stellar Pricer by Syncrone** - Bringing institutional-grade price oracle capabilities to the Stellar network.