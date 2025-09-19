# Nefture
## Bringing Stellar to Institutional-Grade Portfolio Monitoring

"Offers real-time & historical Stellar portfolio tracking to help funds and users monitor risk and PnL with institutional precision."

## 📄 Nefture x Stellar – Technical Architecture

### Project Overview
Nefture is developing a comprehensive institutional-grade portfolio monitoring solution specifically designed for Stellar's ecosystem. Our architecture bridges the gap between traditional finance requirements and DeFi innovation by providing deep, granular visibility into portfolio performance, risk metrics, and asset allocation across Stellar's network.
The project transforms Stellar portfolio management from manual tracking to automated, institutional-grade monitoring with historical reconstruction capabilities. With a total budget of $91,000 USD allocated across 7 deliverables, the project spans from September 2025 to February 2026, bringing enterprise-level portfolio intelligence to Stellar.

## 🏗️ This Repository - Stellar Price Oracle Foundation

This repository contains the foundational components for the Nefture Intelligence Layer, specifically focusing on the **Price Oracle Infrastructure** that serves as the core pricing engine for the entire portfolio monitoring system.

### What We're Building

**Unified Oracle Pricer System**: A comprehensive price oracle solution that aggregates data from multiple sources to provide accurate, real-time pricing for all Stellar assets. This system forms the critical foundation for portfolio valuation and risk assessment.

### Core Components

#### 🔧 Smart Contracts
- **`stellar_price_oracle.rs`**: Core price oracle smart contract with multi-source data aggregation
- **`comprehensive_price_oracle.rs`**: Enhanced oracle with advanced features and confidence scoring
- **`contracts/comprehensive-oracle/`**: Complete Soroban contract package with deployment configuration

#### 📊 Data Feeder System
- **`oracle-data-feeder.js`**: Real-time data fetching from Stellar DEX, AMM pools, and orderbooks
- **`real-data-integration.js`**: Integration layer for external price feeds and data sources
- **`price-oracle-client.js`**: Client library for interacting with oracle contracts

#### 🖥️ Web Interface
- **`stellar-pricer.html`**: Interactive dashboard for monitoring price feeds and oracle status
- **`stellar-pricer-english.html`**: English version of the pricing dashboard
- **`stellar.tsx`**: React components for modern web interface

#### 🚀 Deployment & Integration
- **`deploy-comprehensive.sh`**: Automated deployment script for oracle contracts
- **`soroban-integration.sh`**: Soroban integration utilities and helpers
- **`quick-start-deployed.sh`**: Quick start script for immediate deployment

### Key Features

#### Multi-Source Price Aggregation
- **AMM Pool Data**: Real-time liquidity pool reserves and pricing
- **Orderbook Data**: Bid/ask spreads from Stellar DEX
- **External Oracles**: Integration with trusted price feeds
- **Confidence Scoring**: Quality metrics based on liquidity and data freshness

#### Supported Assets
- **XLM**: Native Stellar Lumens
- **USDC**: USD Coin (Circle)
- **USDT**: Tether USD
- **AQUA**: Aquarius token
- **yXLM**: Yield-bearing XLM
- **MOBI**: Mobius token
- **Custom Assets**: Any Stellar asset with liquidity pools

#### Real-Time Updates
- **5-minute intervals**: Configurable update frequency
- **Automatic retry logic**: Robust error handling and recovery
- **Data validation**: Confidence scoring and outlier detection
- **Historical tracking**: Complete price history for analytics

### Technical Implementation

#### Oracle Contract Features
```rust
pub struct TokenPrice {
    pub asset_code: Symbol,
    pub asset_issuer: Option<Address>,
    pub price_usd: i128,        // 7-decimal fixed point precision
    pub confidence: u32,        // 0-100 confidence score
    pub liquidity_usd: i128,    // Total liquidity in USD
    pub last_update: u64,       // Timestamp
    pub sources: Vec<Symbol>,   // AMM, ORDERBOOK, ORACLE
}
```

#### Data Feeder Capabilities
- Direct Stellar Horizon API integration
- AMM pool reserve monitoring
- Orderbook depth analysis
- Multi-source price validation
- Automatic contract updates

#### Web Dashboard Features
- Real-time price monitoring
- Asset portfolio tracking
- Oracle health status
- Historical price charts
- Configuration management

### Integration with Nefture Architecture

This price oracle system directly implements **Layer 2: Normalization & Enrichment** of the Nefture architecture:

- **Custom Asset Pricer**: Prices any Stellar token based on liquidity pools
- **Price Oracle Integration**: Multi-source feeds with confidence scoring
- **Asset Classifier**: Automatic categorization of tokens and positions
- **Data Validation**: Outlier detection and quality assurance

The oracle provides the foundational pricing data that enables:
- Portfolio valuation and PnL calculations
- Risk metrics computation (VaR, Sharpe ratios)
- Performance attribution analysis
- Cross-chain asset pricing

### Quick Start

1. **Deploy Oracle Contract**:
   ```bash
   ./deploy-comprehensive.sh
   ```

2. **Start Data Feeder**:
   ```bash
   node oracle-data-feeder.js
   ```

3. **Access Dashboard**:
   Open `stellar-pricer.html` in your browser

### Configuration

Set environment variables for your deployment:
```bash
export STELLAR_NETWORK=testnet  # or mainnet
export CONTRACT_ID=your_contract_id
export ADMIN_SECRET_KEY=your_admin_secret_key
export UPDATE_INTERVAL=300  # seconds
```

This price oracle foundation enables the entire Nefture Intelligence Layer by providing accurate, real-time pricing data essential for institutional-grade portfolio monitoring and risk management.

### Technical Architecture
#### Four-Layer Architecture
Nefture's solution consists of four integrated layers designed for institutional precision:

**1. Direct Blockchain Data Layer**
The foundation layer extracts raw ledger data directly from Stellar's blockchain:
- On-Chain Indexer: Direct blockchain access capturing all transaction types with complete data fidelity
- Transaction Decoder: Comprehensive decoding of DeFi transactions
- Soroban Event Monitor: Real-time tracking of smart contract interactions and state changes
- Historical Reconstruction Engine: Complete portfolio state recreation from wallets genesis to present as well as liquidity pools and lending markets

**2. Normalization & Enrichment Layer**
The processing layer transforms raw blockchain data into institutional-grade analytics:
- Asset Classifier: Automatic categorization of tokens, LP positions, and derivative instruments
- Price Oracle Integration: Multi-source price feeds with confidence scoring and outlier detection
- Custom Asset Pricer: Price any tokens based on liquidity pools for accurate valuation
- Transaction Categorizer: Intelligent classification of swaps, deposits, withdrawals, and complex DeFi interactions
- Cross-Reference Engine: Linking related transactions for complete activity understanding

**3. Analytics & Risk Engine**
The intelligence layer computes institutional metrics and risk indicators:
- Performance Calculator: Time-weighted returns, money-weighted returns, and benchmark comparisons
- Risk Metrics Suite: APY, PnL, VaR, CVaR, Sharpe ratios, maximum drawdown, and correlation matrices
- Attribution Analysis: Performance attribution by asset, protocol, and strategy
- Scenario Engine: Stress testing and what-if analysis for portfolio positions

**4. Delivery & Integration Layer**
The presentation layer provides multiple access points for institutional users:
- Enterprise Dashboard: React-based interface with institutional-grade visualizations
- REST API: Programmatic access with OpenAPI specification for automated reporting
- Feeds: Real-time portfolio updates and alert streaming
- Export Suite: Regulatory-compliant reporting in multiple formats (CSV, JSON, PDF)

### Architecture Graph

### Implementation Details

#### Technical Stack
- TypeScript & Node.js 20: API layer, background queue workers, and webhook processing. 
- Soroban RPC: Contract calls and event ingestion, with stellar-sdk in TypeScript
- PostgreSQL: Primary transactional database for positions, ledgers, and historical records. 
- Redis: Low-latency caching for price data, recent positions, and API responses. 
- Apollo GraphQL: Unified query layer providing cross-chain, normalized portfolio data to clients. 
- Next.js: Frontend 

#### Data Pipeline Architecture

**Blockchain Synchronization**
Our indexer maintains perfect synchronization with Stellar's ledger through a sophisticated checkpoint and recovery system. The architecture implements parallel processing for historical backfill while maintaining real-time ingestion, ensuring zero data gaps even during high-throughput periods.

**Event Processing Framework**
Events flow through a multi-stage pipeline with built-in retry logic and dead letter queues. Each stage validates data integrity through cryptographic verification, ensuring institutional-grade data accuracy. 

**Database Architecture**
We implement a hybrid storage strategy combining hot storage for recent data (PostgreSQL) with cold storage for historical archives (S3/Parquet). This approach optimizes query performance while maintaining cost efficiency for multi-year historical analysis.

#### Analytics Engine Implementation

**Portfolio Reconstruction**
Our unique temporal database design allows point-in-time portfolio reconstruction at any historical moment. This enables accurate historical performance calculation, essential for institutional reporting and compliance requirements.

**Risk Modeling**
The risk engine employs factor models adapted from traditional finance, including multi-factor attribution and stress testing scenarios specific to DeFi risks such as impermanent loss, smart contract risk, and liquidity risk.

**Performance Metrics**
Beyond simple ROI and APY, we calculate institutional metrics including time-weighted returns, money-weighted returns, risk-adjusted returns, and benchmark-relative performance - all essential for professional portfolio management.

#### Cross-Chain Architecture

**Unified Data Model**
Stellar data seamlessly integrates with existing EVM chain support (Ethereum, Arbitrum, Base) through our normalized data model. Users see unified portfolio views across all supported chains.

**Cross-Chain Analytics**
Performance and risk metrics aggregate across chains, providing true portfolio-level insights. Correlation analysis identifies cross-chain dependencies and risks.

## Detailed Deliverables 

### Deliverable 1: Indexing Infrastructure
**Budget**: $21,000 | **Timeline**: September 30th, 2025

**Technical Components from Architecture:**
- On-Chain Indexer (Layer 1): Direct blockchain access bypassing Horizon API, capturing all transaction types with complete data fidelity
- Transaction Decoder (Layer 1): Comprehensive decoding of payment operations, path payments, manage offers, and all 30+ Stellar operation types
- Historical Reconstruction Engine (Layer 1): Complete portfolio state recreation from wallet genesis to present
- Custom Asset Pricer (Layer 2): Price calculation based on liquidity pools for accurate valuation
- Price Oracle Integration (Layer 2): Multi-source price feeds with confidence scoring

**Implementation Details:**
- Direct Stellar Core RPC connection for raw ledger data extraction
- XDR decoder for transaction parsing
- Parallel processing engine for historical backfill
- Checkpoint and recovery system for reliability
- Integration with PostgreSQL for time-series data storage

**Acceptance Criteria:**
- 5+ Stellar wallets indexed with complete history from genesis
- 100% data accuracy validated against blockchain
- Custom asset pricer operational for all Stellar assets
- Price data available for both real-time and historical queries
- GitHub repository with comprehensive documentation

### Deliverable 2: DeFi Protocol & Position Etude, Indexing and Integration
**Budget**: $20,000 | **Timeline**: October 20th, 2025

**Technical Components from Architecture:**
- Protocol Decoder (Layer 1): Specialized decoders for Stellar DEX operations and AMM positions
- Soroban Event Monitor (Layer 1): Real-time tracking of smart contract interactions
- Asset Classifier (Layer 2): Automatic categorization of tokens, LP positions, and derivatives
- Transaction Categorizer (Layer 2): Intelligent classification of swaps, deposits, withdrawals

**Protocol Support (from architecture diagram):**
- StellarX integration
- Stellar DEX native operations
- Blend Capital 
- Phoenix protocol
- Defindex
- Lumenswap

**Implementation Details:**
- SDEX order book activity decoder
- AMM liquidity pool position tracking
- LP share calculation and impermanent loss computation
- Soroban contract event decoding
- Normalized data models for cross-protocol compatibility

**Acceptance Criteria:**
- 2+ major Stellar protocols fully decoded
- LP positions tracked with share calculations
- Impermanent loss calculated within 0.1% accuracy
- Yield accrual tracking operational
- Complete test suite covering all protocol types

### Deliverable 3: Institutional Analytics Engine
**Budget**: $20,500 | **Timeline**: November 30th, 2025

**Technical Components from Architecture:**
- Performance Calculator (Layer 3): Time-weighted returns, money-weighted returns, benchmark comparisons
- Risk Metrics Suite (Layer 3): APY, PnL, VaR, CVaR, Sharpe ratios, maximum drawdown
- Attribution Analysis (Layer 3): Performance attribution by asset, protocol, and strategy
- Scenario Engine (Layer 3): Stress testing and what-if analysis

**Implementation Details:**
- Temporal database design for point-in-time reconstruction
- Factor models adapted from traditional finance
- Multi-factor attribution analysis
- Institutional metrics calculation (TWR, MWR, risk-adjusted returns)
- Integration with normalized data store

**Acceptance Criteria:**
- Process any Stellar wallet with complete historical metrics
- Calculate ROI, PnL, and balance changes accurately
- Time-weighted and money-weighted returns operational
- Risk metrics (VaR, Sharpe) calibrated for Stellar volatility
- Attribution analysis functional across assets and protocols

### Deliverable 4: Cross-Chain Integration Layer (Staging Deployment)
**Budget**: $8,000 | **Timeline**: December 15th, 2025

**Technical Components from Architecture:**
- Cross-Chain Aggregator (Layer 3): Unified portfolio view across chains
- Unified Data Model (Cross-Chain Architecture): Normalized model for Stellar + EVM chains
- Cross-Chain Analytics (Cross-Chain Architecture): Aggregated metrics across all chains

**Implementation Details:**
- Integration with existing EVM chain support (Ethereum, Arbitrum, Base)
- Normalized data model for cross-chain assets
- Unified portfolio aggregation logic
- Correlation analysis for cross-chain dependencies
- React-based dashboard integration (Next.js frontend)

**Acceptance Criteria:**
- Combined Stellar + EVM positions displayed in dashboard
- Aggregated metrics across all chains
- Token balances and position values visible
- Historical value-over-time charts operational
- Deployed and functional in staging environment

### Deliverable 5: Production Deployment (Live App)
**Budget**: $12,500 | **Timeline**: December 30th, 2025

**Technical Components from Architecture:**
- Enterprise Dashboard (Layer 4): React-based interface with institutional visualizations
- PostgreSQL database with TimescaleDB for production
- Redis caching layer for performance
- Apollo GraphQL for unified query layer

**Infrastructure Setup:**
- Multi-region deployment for reliability
- Checkpoint and recovery system activated
- Hybrid storage strategy (hot/cold) implemented
- Real-time synchronization with Stellar ledger

**Acceptance Criteria:**
- Stellar wallets added in production environment
- Token balances and portfolio values displayed
- Time-series charts functional
- Historical PnL and ROI calculations operational
- Feature parity with existing EVM dashboards
- Serving real institutional clients

### Deliverable 6: Public API & Documentation
**Budget**: $5,000 | **Timeline**: January 10, 2026

**Technical Components from Architecture:**
- REST API (Layer 4): Programmatic access with OpenAPI specification
- Apollo GraphQL API endpoints
- Export Suite integration for API responses

**API Endpoints (from architecture):**
- /api/v1/portfolio/{address} - Current portfolio snapshot
- /api/v1/portfolio/{address}/historical - Historical portfolio state
- /api/v1/analytics/{address}/performance - Performance metrics
- /api/v1/risk/{address} - Risk metrics

**Acceptance Criteria:**
- Published OpenAPI documentation
- All endpoints functional and tested
- Example integrations provided
- Developer portal live
- Rate limiting and authentication implemented

### Deliverable 7: Enterprise Dashboard & Tools
**Budget**: $4,000 | **Timeline**: January 30, 2026

**Technical Components from Architecture:**
- Enterprise Dashboard (Layer 4): Full production features
- Export Suite (Layer 4): CSV, JSON, PDF formats
- Regulatory-compliant reporting capabilities

**Dashboard Features:**
- Institutional-grade visualizations 
- Custom reports for Stellar wallets
- Position and holdings detailed views
- White-label capabilities
- Performance benchmarks display

**Acceptance Criteria:**
- Fully functional dashboard in production
- 10+ beta users actively using the platform
- Export functionality operational (CSV, JSON, PDF)
- Custom reports generation working
- Regulatory-compliant reporting available

## Conclusion
Nefture's architecture for Stellar represents a paradigm shift in portfolio management, bringing institutional-grade capabilities to the Stellar ecosystem. Our direct blockchain integration approach ensures data accuracy and completeness unmatched by API-based solutions.
The successful implementation will establish Stellar as a viable option for institutional portfolio allocation, with the transparency and risk management tools required for professional asset management. This infrastructure will catalyze institutional adoption of Stellar, driving liquidity and innovation across the ecosystem.