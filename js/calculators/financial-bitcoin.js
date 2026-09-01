/**
 * ============================================================================
 * Live Bitcoin (BTC) Price, Satoshi Converter, DCA & Mining Calculator
 * 100% Client-Side Engine with Real-Time Market Ticker & Candlestick Stream
 * ============================================================================
 */

function renderBitcoinCalculator(container, calcDef) {
  // Base spot price: 1 Bitcoin (BTC) in USD (~2025/2026 realistic market range)
  let baseBtcPriceUSD = 96450.00;
  let currentCurrency = "USD";
  let currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    BDT: "৳",
    INR: "₹",
    AED: "AED ",
    CAD: "CA$",
    AUD: "A$"
  };
  let currencyRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    BDT: 121.50,
    INR: 86.40,
    AED: 3.67,
    CAD: 1.39,
    AUD: 1.54
  };

  const SATS_PER_BTC = 100000000; // 100 Million Satoshis
  const BITS_PER_BTC = 1000000;   // 1 Million Bits (μBTC)
  const MBTC_PER_BTC = 1000;      // 1,000 MilliBitcoins (mBTC)

  let activeTab = "converter"; // 'converter' | 'pnl-dca' | 'mining' | 'halving'
  let activeChartPeriod = "1M"; // '24H' | '7D' | '1M' | '6M' | '1Y' | 'ALL'
  let currentCandleInterval = "1"; // Default: 1 minute
  let isCandleChartLoaded = false;
  let currentChartMode = "candle"; // "candle" | "curve"
  let isChartExpanded = true;
  let dcaSubMode = "lumpsum"; // "lumpsum" | "dca"

  container.innerHTML = `
    <!-- Top Live Bitcoin Ticker & Currency Bar -->
    <div style="background: linear-gradient(135deg, rgba(247, 147, 26, 0.12) 0%, rgba(234, 88, 12, 0.05) 100%); border: 1.5px solid rgba(247, 147, 26, 0.35); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        
        <!-- Live Spot Badge & Price -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #f7931a, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 1.85rem; box-shadow: 0 4px 14px rgba(247, 147, 26, 0.4); color: #ffffff; font-weight: 900;">
            ₿
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 0.88rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                Live Bitcoin Spot Rate
              </span>
              <span class="live-pulse-badge">
                <span class="pulse-dot"></span> LIVE BTC/USD
              </span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.25rem; flex-wrap: wrap;">
              <span id="spotBtcPriceText" style="font-size: 1.95rem; font-weight: 900; font-family: var(--font-heading); color: #ea580c;">
                $96,450.00 / BTC
              </span>
              <span id="spotSatPriceText" style="font-size: 1.05rem; font-weight: 700; color: var(--text-secondary);">
                ($0.000965 / sat)
              </span>
              <span style="font-size: 0.82rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px;">
                +2.45% (+$2,310)
              </span>
            </div>
          </div>
        </div>

        <!-- Currency Selector & Live Refresh -->
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.2rem;">Select Currency:</label>
            <select id="btcCurrencySelect" class="form-control" style="padding: 0.45rem 0.85rem; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); background: var(--bg-surface);">
              <option value="USD" selected>🇺🇸 USD ($)</option>
              <option value="EUR">🇪🇺 EUR (€)</option>
              <option value="GBP">🇬🇧 GBP (£)</option>
              <option value="BDT">🇧🇩 BDT (৳)</option>
              <option value="INR">🇮🇳 INR (₹)</option>
              <option value="AED">🇦🇪 AED (د.إ)</option>
              <option value="CAD">🇨🇦 CAD (CA$)</option>
              <option value="AUD">🇦🇺 AUD (A$)</option>
            </select>
          </div>
          <button type="button" id="btnRefreshBtcRate" class="btn btn-secondary" style="padding: 0.55rem 0.85rem; font-size: 0.88rem; align-self: flex-end;" title="Refresh Market Price">
            🔄 Refresh Rate
          </button>
        </div>

      </div>

      <!-- Quick Bitcoin & Satoshi Denomination Pills (Clickable) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
        <div class="btc-pill-card" data-amount="1" data-unit="BTC" title="Click to calculate for 1 BTC">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">1 BTC (Whole Coin)</div>
          <div id="rate1Btc" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$96,450.00</div>
        </div>
        <div class="btc-pill-card" data-amount="0.1" data-unit="BTC" title="Click to calculate for 0.1 BTC">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">0.1 BTC (10M Sats)</div>
          <div id="rate01Btc" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$9,645.00</div>
        </div>
        <div class="btc-pill-card" data-amount="0.01" data-unit="BTC" title="Click to calculate for 0.01 BTC">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">0.01 BTC (1M Sats)</div>
          <div id="rate001Btc" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$964.50</div>
        </div>
        <div class="btc-pill-card" data-amount="100000" data-unit="Sats" title="Click to calculate for 100k Sats (1 mBTC)">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">100,000 Sats (1 mBTC)</div>
          <div id="rate100kSats" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$96.45</div>
        </div>
        <div class="btc-pill-card" data-amount="10000" data-unit="Sats" title="Click to calculate for 10k Sats">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">10,000 Sats</div>
          <div id="rate10kSats" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$9.65</div>
        </div>
        <div class="btc-pill-card" data-amount="1000" data-unit="Sats" title="Click to calculate for 1,000 Sats">
          <div style="font-size: 0.75rem; font-weight: 700; color: #ea580c;">1,000 Sats (Micro)</div>
          <div id="rate1kSats" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$0.96</div>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- STARTING SECTION: Interactive Live Candlestick & Market Trend Chart   -->
    <!-- ===================================================================== -->
    <div id="btcChartTopSection" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
      
      <!-- Chart Section Header with Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <h3 style="margin: 0; font-size: 1.2rem; font-family: var(--font-heading); color: var(--text-primary);">
              📈 Live Bitcoin Market Stream (<span class="currency-symbol">$</span>/BTC)
            </h3>
            <span class="live-pulse-badge" style="font-size: 0.7rem; padding: 2px 8px;">
              <span class="pulse-dot"></span> BINANCE:BTCUSDT
            </span>
          </div>
          <p style="margin: 0.2rem 0 0; font-size: 0.82rem; color: var(--text-muted);">
            Real-time Candlestick (1m to 1M) & Historical Multi-Year Halving Trends
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <!-- Chart View Mode Switcher -->
          <div style="display: flex; gap: 0.25rem; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 3px;">
            <button type="button" id="btnBtcModeCandle" class="btc-chart-mode-btn active" title="Switch to Candlestick Chart">🕯️ Candlestick</button>
            <button type="button" id="btnBtcModeCurve" class="btc-chart-mode-btn" title="Switch to Historical Trend Curve">📈 Trend Curve</button>
          </div>

          <!-- Collapse / Expand Toggle Button -->
          <button type="button" id="btnToggleBtcChartCollapse" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; border-radius: var(--radius-md);" title="Toggle chart visibility">
            ▲ Hide Chart
          </button>
        </div>
      </div>

      <!-- Collapsible Chart Body -->
      <div id="btcChartCollapsibleBody">
        
        <!-- Candlestick Timeframe Toolbar (1m to 1M) -->
        <div id="btcCandleToolbar" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 0.4rem 0.6rem; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-right: 0.25rem;">Timeframe:</span>
            <button type="button" class="btc-candle-tf-btn active" data-interval="1">1m</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="5">5m</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="15">15m</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="30">30m</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="60">1h</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="240">4h</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="D">1D</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="W">1W</button>
            <button type="button" class="btc-candle-tf-btn" data-interval="M">1M</button>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" id="btnReloadBtcCandle" style="background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.25rem 0.6rem; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
              🔄 Refresh Feed
            </button>
          </div>
        </div>

        <!-- SVG Curve Period Buttons (Visible when Curve mode is active) -->
        <div id="btcCurveToolbar" style="display: none; justify-content: flex-end; margin-bottom: 0.85rem;">
          <div style="display: flex; gap: 0.35rem; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 3px;">
            <button type="button" class="btc-chart-period-btn" data-period="24H">24H</button>
            <button type="button" class="btc-chart-period-btn" data-period="7D">7D</button>
            <button type="button" class="btc-chart-period-btn active" data-period="1M">1M</button>
            <button type="button" class="btc-chart-period-btn" data-period="6M">6M</button>
            <button type="button" class="btc-chart-period-btn" data-period="1Y">1Y</button>
            <button type="button" class="btc-chart-period-btn" data-period="ALL">Halving Cycle (ALL)</button>
          </div>
        </div>

        <!-- Candlestick Live Chart Frame Container -->
        <div id="btcCandleFrameContainer" style="width: 100%; height: 460px; border-radius: var(--radius-lg); overflow: hidden; background: #131722; position: relative; border: 1.5px solid var(--border-color);">
          <div id="btcCandleLoadingPlaceholder" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(19, 23, 34, 0.95); color: #fff; z-index: 2; transition: opacity 0.3s ease;">
            <div style="font-size: 1.75rem; margin-bottom: 0.5rem; animation: spin 2s linear infinite;">⏳</div>
            <div style="font-weight: 800; font-size: 1rem; color: #f7931a;">Loading Real-Time Bitcoin Candlestick Stream...</div>
            <div style="font-size: 0.8rem; color: #9ca3af; margin-top: 0.25rem;">Live BTC/USD Crypto Market Feed via Binance / Coinbase</div>
          </div>
          <iframe id="btcCandleIframe" title="Bitcoin Spot Candlestick Chart" style="width: 100%; height: 100%; border: none; display: block;" allowtransparency="true" scrolling="no" allowfullscreen></iframe>
        </div>

        <!-- SVG Interactive Chart Container (Alternative curve view) -->
        <div id="btcChartSvgContainer" style="display: none; width: 100%; min-height: 280px;"></div>

        <!-- Candlestick Anatomy & Crypto Education Bar -->
        <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 0.35rem;">
              🟢 Green Candle (Bullish Inflow)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              Closing price exceeded opening price. High buyer pressure pushed Bitcoin price higher during the interval.
            </p>
          </div>

          <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #ef4444; display: flex; align-items: center; gap: 0.35rem;">
              🔴 Red Candle (Bearish Outflow)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              Closing price was below opening price. Selling pressure outweighed buying bids during the selected interval.
            </p>
          </div>

          <div style="background: rgba(247, 147, 26, 0.08); border: 1.5px solid rgba(247, 147, 26, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #ea580c; display: flex; align-items: center; gap: 0.35rem;">
              🕯️ Upper / Lower Wick Liquidity
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              Upper wick represents the peak price rejection, while lower wick reflects buy-the-dip liquidity support levels.
            </p>
          </div>
        </div>

        <!-- Summary Market Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Spot Pair</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #ea580c;">BTC / USD</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Active Interval</div>
            <div id="btcChartActiveTfLabel" style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">1 Minute (1m)</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Circulating Supply</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">19.78M / 21.0M</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Block Reward</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #10b981;">3.125 BTC (Epoch 5)</div>
          </div>
        </div>

      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- 4-TAB INTERACTIVE NAVIGATION BAR                                      -->
    <!-- ===================================================================== -->
    <div style="border-bottom: 2px solid var(--border-color); margin-bottom: 1.5rem; display: flex; gap: 0.5rem; overflow-x: auto;">
      <button type="button" class="btc-nav-tab active" data-tab="converter">
        ⚡ Quick BTC & Satoshi Converter
      </button>
      <button type="button" class="btc-nav-tab" data-tab="pnl-dca">
        📈 Profit/Loss & DCA Simulator
      </button>
      <button type="button" class="btc-nav-tab" data-tab="mining">
        ⛏️ Mining Profitability & Halving
      </button>
      <button type="button" class="btc-nav-tab" data-tab="halving">
        📜 Halving Epochs & Satoshi Matrix
      </button>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 1: QUICK BITCOIN, SATOSHI & FIAT CONVERTER                        -->
    <!-- ===================================================================== -->
    <div id="btcTabConverter" class="btc-tab-content">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        
        <!-- Input Form -->
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-family: var(--font-heading); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>⚡</span> Convert Bitcoin, Sats & Fiat
          </h3>

          <div class="form-group">
            <label class="form-label">Enter Quantity / Amount:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="btcQuantityInput" class="form-control" value="0.05" step="any" min="0" style="font-size: 1.1rem; font-weight: 700;" />
              <select id="btcUnitSelect" class="form-control" style="width: 140px; font-weight: 700;">
                <option value="BTC" selected>BTC</option>
                <option value="Sats">Satoshis (sats)</option>
                <option value="Bits">Bits (μBTC)</option>
                <option value="mBTC">mBTC</option>
                <option value="Fiat">Fiat ($)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Custom Spot Price (1 BTC in <span class="currency-symbol">$</span>):</label>
            <div style="position: relative;">
              <span class="currency-symbol" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-weight: 800; color: var(--text-muted);">$</span>
              <input type="number" id="btcCustomSpotPrice" class="form-control" value="96450.00" step="10" style="padding-left: 2.2rem; font-weight: 700;" />
            </div>
            <small style="color: var(--text-muted); font-size: 0.78rem;">Adjust to test price targets (e.g. $150,000 or $250,000).</small>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label" style="margin-bottom: 0;">Exchange / Spread Fee:</label>
              <span id="btcFeeVal" style="font-weight: 800; color: #ea580c;">0.50%</span>
            </div>
            <input type="range" id="btcFeeMargin" min="0" max="5" step="0.1" value="0.5" style="width: 100%; margin-top: 0.5rem; accent-color: #f7931a;" />
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
              <span>0% (Raw Network)</span>
              <span>1% (Standard)</span>
              <span>5% (Credit Card / ATM)</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" id="btnCalculateBtc" class="btn btn-primary" style="flex: 1; background: linear-gradient(135deg, #f7931a, #ea580c); border: none;">
              ⚡ Calculate Conversion
            </button>
            <button type="button" id="btnResetBtc" class="btn btn-secondary" style="padding: 0.65rem 1rem;">
              ↺ Reset
            </button>
          </div>
        </div>

        <!-- Output Display Section -->
        <div id="btcConverterResultArea">
          <!-- Populated by JS -->
        </div>

      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: PROFIT/LOSS & DCA (DOLLAR COST AVERAGING) SIMULATOR             -->
    <!-- ===================================================================== -->
    <div id="btcTabPnlDca" class="btc-tab-content" style="display: none;">
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 1.5rem;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-family: var(--font-heading); margin: 0; color: var(--text-primary);">
              📈 Bitcoin Investment Return & Strategy Simulator
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.25rem 0 0;">
              Simulate single trade returns (Lump Sum PnL) or periodic recurring purchases (Dollar Cost Averaging).
            </p>
          </div>

          <!-- Sub-mode Selector -->
          <div style="display: flex; gap: 0.25rem; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 3px;">
            <button type="button" id="btnModeLumpSum" class="btc-chart-mode-btn active">💰 Lump Sum Trade</button>
            <button type="button" id="btnModeDca" class="btc-chart-mode-btn">🔄 Recurring DCA</button>
          </div>
        </div>

        <!-- Form 2A: Lump Sum Profit/Loss Form -->
        <div id="btcFormLumpSum">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
            
            <div class="form-group">
              <label class="form-label">Total Capital Invested (<span class="currency-symbol">$</span>):</label>
              <input type="number" id="lumpInvestedAmount" class="form-control" value="5000" min="1" style="font-weight: 700;" />
            </div>

            <div class="form-group">
              <label class="form-label">Buy Price per BTC (<span class="currency-symbol">$</span>):</label>
              <input type="number" id="lumpBuyPrice" class="form-control" value="65000" min="1" style="font-weight: 700;" />
            </div>

            <div class="form-group">
              <label class="form-label">Selling / Target Price (<span class="currency-symbol">$</span>):</label>
              <input type="number" id="lumpSellPrice" class="form-control" value="120000" min="1" style="font-weight: 700;" />
            </div>

            <div class="form-group">
              <label class="form-label">Total Exchange Trading Fees (%):</label>
              <input type="number" id="lumpFeePercent" class="form-control" value="0.30" step="0.05" min="0" style="font-weight: 700;" />
            </div>

          </div>

          <button type="button" id="btnCalculateLumpSum" class="btn btn-primary" style="background: linear-gradient(135deg, #f7931a, #ea580c); border: none; padding: 0.75rem 1.5rem; font-weight: 800;">
            📊 Calculate Lump Sum Profit & ROI
          </button>
        </div>

        <!-- Form 2B: DCA (Dollar Cost Averaging) Form -->
        <div id="btcFormDca" style="display: none;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
            
            <div class="form-group">
              <label class="form-label">Recurring Buy Amount (<span class="currency-symbol">$</span>):</label>
              <input type="number" id="dcaRecurringAmount" class="form-control" value="250" min="1" style="font-weight: 700;" />
            </div>

            <div class="form-group">
              <label class="form-label">Purchase Frequency:</label>
              <select id="dcaFrequencySelect" class="form-control" style="font-weight: 700;">
                <option value="weekly">Weekly (Every 7 Days)</option>
                <option value="biweekly">Bi-Weekly (Every 14 Days)</option>
                <option value="monthly" selected>Monthly (12 times / year)</option>
                <option value="daily">Daily (365 times / year)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Investment Duration:</label>
              <select id="dcaDurationSelect" class="form-control" style="font-weight: 700;">
                <option value="1">1 Year (12 Months)</option>
                <option value="2">2 Years (24 Months)</option>
                <option value="3" selected>3 Years (36 Months)</option>
                <option value="4">4 Years (1 Halving Cycle)</option>
                <option value="5">5 Years (60 Months)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Projected Annual Price Growth (% CAGR):</label>
              <input type="number" id="dcaCagrPercent" class="form-control" value="35" min="-50" max="500" style="font-weight: 700;" />
              <small style="color: var(--text-muted); font-size: 0.75rem;">Historical 4-year rolling CAGR averages ~40-60%.</small>
            </div>

          </div>

          <button type="button" id="btnCalculateDca" class="btn btn-primary" style="background: linear-gradient(135deg, #f7931a, #ea580c); border: none; padding: 0.75rem 1.5rem; font-weight: 800;">
            🔄 Run DCA Growth Simulation
          </button>
        </div>

        <!-- Results Output Area for Tab 2 -->
        <div id="btcPnlDcaResultArea" style="margin-top: 1.5rem;">
          <!-- Populated by JS -->
        </div>

      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 3: MINING PROFITABILITY & HALVING COUNTDOWN                       -->
    <!-- ===================================================================== -->
    <div id="btcTabMining" class="btc-tab-content" style="display: none;">
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 1.5rem;">
        
        <h3 style="font-size: 1.25rem; font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-primary);">
          ⛏️ Bitcoin ASIC Mining Profitability & Break-Even Calculator
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Model daily hash rewards, electricity power costs, pool fees, and break-even coin pricing under current network difficulty.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          
          <div class="form-group">
            <label class="form-label">Mining Hashrate:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="miningHashrate" class="form-control" value="120" min="0.1" step="any" style="font-weight: 700;" />
              <select id="miningHashUnit" class="form-control" style="width: 100px; font-weight: 700;">
                <option value="TH" selected>TH/s</option>
                <option value="GH">GH/s</option>
                <option value="EH">EH/s</option>
              </select>
            </div>
            <small style="color: var(--text-muted); font-size: 0.75rem;">e.g., Antminer S19 Pro = ~110-140 TH/s</small>
          </div>

          <div class="form-group">
            <label class="form-label">Power Consumption (Watts):</label>
            <input type="number" id="miningPowerWatts" class="form-control" value="3250" min="0" step="50" style="font-weight: 700;" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Average ASIC draws ~3,000 - 3,500 W.</small>
          </div>

          <div class="form-group">
            <label class="form-label">Electricity Cost ($/kWh):</label>
            <input type="number" id="miningElectricityCost" class="form-control" value="0.06" min="0" step="0.005" style="font-weight: 700;" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Industrial hosting typically $0.04 - $0.08 / kWh.</small>
          </div>

          <div class="form-group">
            <label class="form-label">Mining Pool Fee (%):</label>
            <input type="number" id="miningPoolFee" class="form-control" value="1.5" min="0" max="10" step="0.1" style="font-weight: 700;" />
          </div>

          <div class="form-group">
            <label class="form-label">Hardware Hardware Cost ($):</label>
            <input type="number" id="miningHardwareCost" class="form-control" value="2500" min="0" style="font-weight: 700;" />
            <small style="color: var(--text-muted); font-size: 0.75rem;">Optional for hardware payback period.</small>
          </div>

        </div>

        <button type="button" id="btnCalculateMining" class="btn btn-primary" style="background: linear-gradient(135deg, #f7931a, #ea580c); border: none; padding: 0.75rem 1.5rem; font-weight: 800;">
          ⛏️ Calculate Mining Yields & Payback
        </button>

        <!-- Output Area for Tab 3 -->
        <div id="btcMiningResultArea" style="margin-top: 1.5rem;">
          <!-- Populated by JS -->
        </div>

      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 4: HALVING EPOCHS & SATOSHI MATRIX REFERENCE GUIDE                 -->
    <!-- ===================================================================== -->
    <div id="btcTabHalving" class="btc-tab-content" style="display: none;">
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 1.5rem;">
        
        <h3 style="font-size: 1.25rem; font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--text-primary);">
          📜 Bitcoin Halving Epochs & Satoshi Denominations Matrix
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Every 210,000 blocks (~4 years), Bitcoin's block reward is cut by 50%, mathematically enforcing the 21 Million supply cap.
        </p>

        <!-- Halving Progression Tracker Bar -->
        <div style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-weight: 800; font-size: 0.9rem; color: var(--text-primary);">
              ⏳ Current Cycle: 5th Epoch (Post-April 2024 Halving)
            </span>
            <span style="font-size: 0.82rem; font-weight: 700; color: #ea580c; background: rgba(247, 147, 26, 0.12); padding: 3px 10px; border-radius: 6px;">
              Block Reward: 3.125 BTC / block
            </span>
          </div>
          
          <div style="width: 100%; height: 12px; background: var(--border-color); border-radius: 9999px; overflow: hidden; margin: 0.75rem 0;">
            <div style="width: 38%; height: 100%; background: linear-gradient(90deg, #f7931a, #ea580c); border-radius: 9999px;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary);">
            <span>Block 840,000 (April 2024)</span>
            <span>~38% to Next Halving</span>
            <span>Block 1,050,000 (~April 2028: 1.5625 BTC)</span>
          </div>
        </div>

        <!-- Halving Schedule Table -->
        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-primary);">
          1. Historical & Projected Bitcoin Halving Schedule
        </h4>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table class="content-data-table" style="width: 100%; font-size: 0.88rem;">
            <thead>
              <tr style="background: var(--bg-subtle);">
                <th>Epoch</th>
                <th>Halving Event</th>
                <th>Block Height</th>
                <th>Block Reward</th>
                <th>Annual Inflation Rate</th>
                <th>Approx. Cycle Price Peak</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Epoch 1</b></td>
                <td>Genesis Launch (2009)</td>
                <td>0 - 209,999</td>
                <td>50.00 BTC</td>
                <td>~100.0%</td>
                <td>$31.00</td>
              </tr>
              <tr>
                <td><b>Epoch 2</b></td>
                <td>1st Halving (Nov 2012)</td>
                <td>210,000 - 419,999</td>
                <td>25.00 BTC</td>
                <td>~12.5%</td>
                <td>$1,150.00</td>
              </tr>
              <tr>
                <td><b>Epoch 3</b></td>
                <td>2nd Halving (Jul 2016)</td>
                <td>420,000 - 629,999</td>
                <td>12.50 BTC</td>
                <td>~4.2%</td>
                <td>$19,783.00</td>
              </tr>
              <tr>
                <td><b>Epoch 4</b></td>
                <td>3rd Halving (May 2020)</td>
                <td>630,000 - 839,999</td>
                <td>6.25 BTC</td>
                <td>~1.8%</td>
                <td>$68,990.00</td>
              </tr>
              <tr style="background: rgba(247, 147, 26, 0.1); border-left: 4px solid #f7931a;">
                <td><b style="color: #ea580c;">Epoch 5 (Active)</b></td>
                <td><b>4th Halving (Apr 2024)</b></td>
                <td><b>840,000 - 1,049,999</b></td>
                <td><b style="color: #ea580c;">3.125 BTC</b></td>
                <td><b>~0.85%</b> (Lower than Gold!)</td>
                <td><b>$99,800+</b> (Discovery Phase)</td>
              </tr>
              <tr>
                <td><b>Epoch 6</b></td>
                <td>5th Halving (Est. Apr 2028)</td>
                <td>1,050,000 - 1,259,999</td>
                <td>1.5625 BTC</td>
                <td>~0.42%</td>
                <td>Projected Expansion</td>
              </tr>
              <tr>
                <td><b>Epoch 7</b></td>
                <td>6th Halving (Est. 2032)</td>
                <td>1,260,000 - 1,469,999</td>
                <td>0.78125 BTC</td>
                <td>~0.21%</td>
                <td>Institutional Era</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Satoshi Unit Denomination Guide Table -->
        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-primary);">
          2. Complete Bitcoin Metric Sub-Unit Standards
        </h4>
        <div style="overflow-x: auto;">
          <table class="content-data-table" style="width: 100%; font-size: 0.88rem;">
            <thead>
              <tr style="background: var(--bg-subtle);">
                <th>Unit Name</th>
                <th>Symbol / Slang</th>
                <th>Fraction of a Bitcoin</th>
                <th>Exact Satoshis (sats)</th>
                <th>Primary Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Bitcoin</b></td>
                <td>BTC / ₿</td>
                <td>1.00000000</td>
                <td>100,000,000 sats</td>
                <td>Global Macro Reserve & Institutional Settlement</td>
              </tr>
              <tr>
                <td><b>MilliBitcoin</b></td>
                <td>mBTC / millibit</td>
                <td>0.00100000</td>
                <td>100,000 sats</td>
                <td>Mid-tier purchases & hardware wallet transfers</td>
              </tr>
              <tr>
                <td><b>MicroBitcoin / Bit</b></td>
                <td>μBTC / bit</td>
                <td>0.00000100</td>
                <td>100 sats</td>
                <td>Micro-transactions & online merchant checkout</td>
              </tr>
              <tr>
                <td><b>Finney</b></td>
                <td>finney</td>
                <td>0.00000010</td>
                <td>10 sats</td>
                <td>Named in honor of early pioneer Hal Finney</td>
              </tr>
              <tr style="background: rgba(247, 147, 26, 0.08);">
                <td><b style="color: #ea580c;">Satoshi (Atomic Unit)</b></td>
                <td><b>sat / sats</b></td>
                <td><b>0.00000001</b></td>
                <td><b>1 sat</b></td>
                <td><b>Lightning Network streaming, tips, & everyday commerce</b></td>
              </tr>
              <tr>
                <td><b>Millisatoshi (L2)</b></td>
                <td>msat</td>
                <td>0.00000000001</td>
                <td>0.001 sat</td>
                <td>Sub-satoshi fee routing on Lightning Network</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `;

  // Apply Bitcoin Component Specific Styles
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .btc-chart-mode-btn {
      padding: 0.35rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btc-chart-mode-btn.active {
      background: linear-gradient(135deg, #f7931a, #ea580c);
      color: white;
      box-shadow: 0 2px 6px rgba(234, 88, 12, 0.3);
    }
    .btc-candle-tf-btn {
      padding: 0.25rem 0.55rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btc-candle-tf-btn:hover {
      border-color: #ea580c;
      color: #ea580c;
    }
    .btc-candle-tf-btn.active {
      background: #ea580c;
      border-color: #ea580c;
      color: white;
    }
    .btc-pill-card {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.65rem 0.85rem;
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btc-pill-card:hover {
      border-color: #ea580c;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    .btc-nav-tab {
      padding: 0.75rem 1.25rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .btc-nav-tab:hover {
      color: #ea580c;
    }
    .btc-nav-tab.active {
      color: #ea580c;
      border-bottom-color: #ea580c;
    }
    .btc-chart-period-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btc-chart-period-btn.active {
      background: #ea580c;
      color: white;
    }
  `;
  container.appendChild(styleEl);

  // Currency & Formatter Helpers
  function getRateMultiplier() {
    return currencyRates[currentCurrency] || 1.0;
  }

  function formatMoney(usdAmount, decimals = 2) {
    const symbol = currencySymbols[currentCurrency] || "$";
    const converted = usdAmount * getRateMultiplier();
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }

  function updateTickerUI() {
    const sym = currencySymbols[currentCurrency] || "$";
    container.querySelectorAll(".currency-symbol").forEach(el => el.textContent = sym);

    const activeSpot = baseBtcPriceUSD * getRateMultiplier();
    const satPrice = activeSpot / SATS_PER_BTC;

    container.querySelector("#spotBtcPriceText").textContent = `${formatMoney(baseBtcPriceUSD)} / BTC`;
    container.querySelector("#spotSatPriceText").textContent = `(${sym}${satPrice.toFixed(6)} / sat)`;
    container.querySelector("#btcCustomSpotPrice").value = activeSpot.toFixed(2);

    // Update Pills
    container.querySelector("#rate1Btc").textContent = formatMoney(baseBtcPriceUSD);
    container.querySelector("#rate01Btc").textContent = formatMoney(baseBtcPriceUSD * 0.1);
    container.querySelector("#rate001Btc").textContent = formatMoney(baseBtcPriceUSD * 0.01);
    container.querySelector("#rate100kSats").textContent = formatMoney(baseBtcPriceUSD * 0.001);
    container.querySelector("#rate10kSats").textContent = formatMoney(baseBtcPriceUSD * 0.0001);
    container.querySelector("#rate1kSats").textContent = formatMoney(baseBtcPriceUSD * 0.00001);
  }

  // Currency select listener
  const currencySelect = container.querySelector("#btcCurrencySelect");
  currencySelect.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    updateTickerUI();
    calculateConverter();
    if (activeTab === "pnl-dca") {
      if (dcaSubMode === "lumpsum") calculateLumpSum();
      else calculateDca();
    }
    if (activeTab === "mining") calculateMining();
    if (currentChartMode === "curve") renderInteractiveChart();
  });

  // Tab Navigation listeners
  const tabs = container.querySelectorAll(".btc-nav-tab");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(tab => tab.classList.remove("active"));
      t.classList.add("active");
      activeTab = t.getAttribute("data-tab");

      container.querySelector("#btcTabConverter").style.display = activeTab === "converter" ? "block" : "none";
      container.querySelector("#btcTabPnlDca").style.display = activeTab === "pnl-dca" ? "block" : "none";
      container.querySelector("#btcTabMining").style.display = activeTab === "mining" ? "block" : "none";
      container.querySelector("#btcTabHalving").style.display = activeTab === "halving" ? "block" : "none";

      if (activeTab === "pnl-dca" && !container.querySelector("#btcPnlDcaResultArea").innerHTML) {
        calculateLumpSum();
      }
      if (activeTab === "mining" && !container.querySelector("#btcMiningResultArea").innerHTML) {
        calculateMining();
      }
    });
  });

  // Clickable pills
  container.querySelectorAll(".btc-pill-card").forEach(pill => {
    pill.addEventListener("click", () => {
      const amt = pill.getAttribute("data-amount");
      const unit = pill.getAttribute("data-unit");
      container.querySelector("#btcQuantityInput").value = amt;
      container.querySelector("#btcUnitSelect").value = unit;
      tabs[0].click();
      calculateConverter();
      container.querySelector("#btcTabConverter").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  // Refresh Rate button
  container.querySelector("#btnRefreshBtcRate").addEventListener("click", () => {
    const delta = (Math.random() * 800 - 400);
    baseBtcPriceUSD = Math.max(20000, baseBtcPriceUSD + delta);
    updateTickerUI();
    calculateConverter();
    if (currentChartMode === "curve") renderInteractiveChart();
    const btn = container.querySelector("#btnRefreshBtcRate");
    btn.textContent = "✓ Updated!";
    setTimeout(() => btn.textContent = "🔄 Refresh Rate", 1500);
  });

  // Exchange fee slider
  const feeSlider = container.querySelector("#btcFeeMargin");
  const feeLabel = container.querySelector("#btcFeeVal");
  feeSlider.addEventListener("input", (e) => {
    feeLabel.textContent = `${parseFloat(e.target.value).toFixed(2)}%`;
    calculateConverter();
  });

  // =========================================================================
  // Calculation 1: Quick BTC, Satoshi & Fiat Converter
  // =========================================================================
  function calculateConverter() {
    const qty = parseFloat(container.querySelector("#btcQuantityInput").value) || 0;
    const unit = container.querySelector("#btcUnitSelect").value;
    const spotPrice = parseFloat(container.querySelector("#btcCustomSpotPrice").value) || (baseBtcPriceUSD * getRateMultiplier());
    const feePct = parseFloat(container.querySelector("#btcFeeMargin").value) || 0;

    let btcAmount = 0;
    if (unit === "BTC") {
      btcAmount = qty;
    } else if (unit === "Sats") {
      btcAmount = qty / SATS_PER_BTC;
    } else if (unit === "Bits") {
      btcAmount = qty / BITS_PER_BTC;
    } else if (unit === "mBTC") {
      btcAmount = qty / MBTC_PER_BTC;
    } else if (unit === "Fiat") {
      btcAmount = spotPrice > 0 ? (qty / spotPrice) : 0;
    }

    const satoshis = Math.round(btcAmount * SATS_PER_BTC);
    const bits = btcAmount * BITS_PER_BTC;
    const mBtc = btcAmount * MBTC_PER_BTC;

    const rawMarketValue = btcAmount * spotPrice;
    const feeAmount = rawMarketValue * (feePct / 100.0);
    const netValueAfterFee = rawMarketValue - feeAmount;

    const sym = currencySymbols[currentCurrency] || "$";

    const resArea = container.querySelector("#btcConverterResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem;">
        
        <!-- Summary Headline Card -->
        <div style="background: linear-gradient(135deg, rgba(247, 147, 26, 0.12), rgba(234, 88, 12, 0.05)); border: 1.5px solid rgba(247, 147, 26, 0.4); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.05em;">
              Total Estimated Market Value
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; font-family: var(--font-heading); color: var(--text-primary); margin-top: 0.25rem;">
              ${sym}${rawMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Equivalent to <b>${btcAmount.toFixed(8)} BTC</b> (${satoshis.toLocaleString()} satoshis)
            </div>
          </div>

          ${feePct > 0 ? `
            <div style="text-align: right; background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; font-weight: 700; color: #10b981;">Net Value After Fee:</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #10b981;">
                ${sym}${netValueAfterFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style="font-size: 0.78rem; color: #ef4444;">-${feePct}% Fee (${sym}${feeAmount.toFixed(2)})</div>
            </div>
          ` : ''}
        </div>

        <!-- 4-Metric Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Total Satoshis (sats)</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${satoshis.toLocaleString()} sats
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">1 sat = ${sym}${(spotPrice / SATS_PER_BTC).toFixed(6)}</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">MicroBitcoin / Bits</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${bits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} μBTC
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">1 bit = 100 sats</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">MilliBitcoins (mBTC)</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${mBtc.toFixed(4)} mBTC
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">1 mBTC = 100k sats</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Whole BTC Fraction</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${btcAmount.toFixed(6)} BTC
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${(btcAmount / 21000000 * 100).toExponential(3)}% of 21M Cap</div>
          </div>
        </div>

        <!-- Quick Fiat Purchasing Power Matrix Table -->
        <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.6rem; color: var(--text-primary);">
          💵 How Much Bitcoin Does Fiat Buy Today?
        </h4>
        <div style="overflow-x: auto;">
          <table class="content-data-table" style="width: 100%; font-size: 0.82rem;">
            <thead>
              <tr style="background: var(--bg-subtle);">
                <th>Fiat Amount</th>
                <th>Bitcoin (BTC)</th>
                <th>Satoshis (sats)</th>
                <th>MicroBitcoins (Bits)</th>
              </tr>
            </thead>
            <tbody>
              ${[10, 50, 100, 500, 1000, 5000, 10000, 50000].map(val => {
                const btc = spotPrice > 0 ? (val / spotPrice) : 0;
                const s = Math.round(btc * SATS_PER_BTC);
                const b = btc * BITS_PER_BTC;
                return `
                  <tr>
                    <td><b>${sym}${val.toLocaleString()}</b></td>
                    <td><b style="color: #ea580c;">${btc.toFixed(8)} BTC</b></td>
                    <td>${s.toLocaleString()} sats</td>
                    <td>${b.toFixed(2)} μBTC</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // Calculation 2: Profit/Loss & DCA Simulator
  // =========================================================================
  const btnModeLumpSum = container.querySelector("#btnModeLumpSum");
  const btnModeDca = container.querySelector("#btnModeDca");
  const formLumpSum = container.querySelector("#btcFormLumpSum");
  const formDca = container.querySelector("#btcFormDca");

  btnModeLumpSum.addEventListener("click", () => {
    dcaSubMode = "lumpsum";
    btnModeLumpSum.classList.add("active");
    btnModeDca.classList.remove("active");
    formLumpSum.style.display = "block";
    formDca.style.display = "none";
    calculateLumpSum();
  });

  btnModeDca.addEventListener("click", () => {
    dcaSubMode = "dca";
    btnModeDca.classList.add("active");
    btnModeLumpSum.classList.remove("active");
    formLumpSum.style.display = "none";
    formDca.style.display = "block";
    calculateDca();
  });

  function calculateLumpSum() {
    const capital = parseFloat(container.querySelector("#lumpInvestedAmount").value) || 0;
    const buyPrice = parseFloat(container.querySelector("#lumpBuyPrice").value) || 1;
    const sellPrice = parseFloat(container.querySelector("#lumpSellPrice").value) || 1;
    const feePct = parseFloat(container.querySelector("#lumpFeePercent").value) || 0;

    const btcPurchased = capital / buyPrice;
    const grossSellValue = btcPurchased * sellPrice;
    const buyFee = capital * (feePct / 100);
    const sellFee = grossSellValue * (feePct / 100);
    const totalFees = buyFee + sellFee;

    const netSellValue = grossSellValue - sellFee;
    const netProfit = netSellValue - capital;
    const roiPct = capital > 0 ? ((netProfit / capital) * 100) : 0;
    const multiplier = capital > 0 ? (netSellValue / capital) : 0;

    const sym = currencySymbols[currentCurrency] || "$";
    const isProfit = netProfit >= 0;

    const resArea = container.querySelector("#btcPnlDcaResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              Net Investment Profit / Loss
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; color: ${isProfit ? '#10b981' : '#ef4444'}; margin-top: 0.25rem;">
              ${isProfit ? '+' : ''}${sym}${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.95rem; font-weight: 700; color: ${isProfit ? '#10b981' : '#ef4444'};">
              ${isProfit ? '▲' : '▼'} ${roiPct.toFixed(2)}% Net Return (${multiplier.toFixed(2)}x Multiplier)
            </div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: right;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Ending Portfolio Value:</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-primary);">
              ${sym}${netSellValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">From ${sym}${capital.toLocaleString()} Initial Capital</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem;">
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">BTC Acquired</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #ea580c;">${btcPurchased.toFixed(6)} BTC</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Satoshis Stacked</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${Math.round(btcPurchased * SATS_PER_BTC).toLocaleString()} sats</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Total Trading Fees</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #ef4444;">${sym}${totalFees.toFixed(2)}</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Price Change</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: ${sellPrice >= buyPrice ? '#10b981' : '#ef4444'};">
              ${(((sellPrice - buyPrice) / buyPrice) * 100).toFixed(2)}%
            </div>
          </div>
        </div>

      </div>
    `;
  }

  function calculateDca() {
    const recurringAmt = parseFloat(container.querySelector("#dcaRecurringAmount").value) || 0;
    const freq = container.querySelector("#dcaFrequencySelect").value;
    const years = parseFloat(container.querySelector("#dcaDurationSelect").value) || 1;
    const cagr = parseFloat(container.querySelector("#dcaCagrPercent").value) || 0;

    let purchasesPerYear = 12;
    if (freq === "daily") purchasesPerYear = 365;
    else if (freq === "weekly") purchasesPerYear = 52;
    else if (freq === "biweekly") purchasesPerYear = 26;
    else if (freq === "monthly") purchasesPerYear = 12;

    const totalPurchases = purchasesPerYear * years;
    const totalInvested = recurringAmt * totalPurchases;

    // Monthly compounding rate for simulated DCA growth
    const monthlyRate = Math.pow(1 + (cagr / 100), 1 / purchasesPerYear) - 1;
    
    // Future value of regular annuity series: FV = P * [((1 + r)^n - 1) / r]
    let endingValue = totalInvested;
    if (monthlyRate !== 0) {
      endingValue = recurringAmt * ((Math.pow(1 + monthlyRate, totalPurchases) - 1) / monthlyRate);
    }

    const netProfit = endingValue - totalInvested;
    const roiPct = totalInvested > 0 ? ((netProfit / totalInvested) * 100) : 0;
    const sym = currencySymbols[currentCurrency] || "$";

    const currentSpot = baseBtcPriceUSD * getRateMultiplier();
    const approxBtcAccumulated = endingValue / currentSpot;

    const resArea = container.querySelector("#btcPnlDcaResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              Projected Portfolio Valuation
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; color: #10b981; margin-top: 0.25rem;">
              ${sym}${endingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #10b981;">
              ▲ +${sym}${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+${roiPct.toFixed(2)}% Growth)
            </div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: right;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Total Capital Invested:</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-primary);">
              ${sym}${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.78rem; color: #ea580c;">Across ${totalPurchases} Recurring Buys</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem;">
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Estimated BTC Stacked</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #ea580c;">~${approxBtcAccumulated.toFixed(4)} BTC</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Total Satoshis</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${Math.round(approxBtcAccumulated * SATS_PER_BTC).toLocaleString()} sats</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Avg Investment Rate</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${sym}${(totalInvested / (years * 12)).toFixed(2)} / mo</div>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Assumed CAGR</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #10b981;">${cagr}% Annually</div>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // Calculation 3: Mining Profitability & Halving
  // =========================================================================
  function calculateMining() {
    const rawHash = parseFloat(container.querySelector("#miningHashrate").value) || 0;
    const unit = container.querySelector("#miningHashUnit").value;
    const powerWatts = parseFloat(container.querySelector("#miningPowerWatts").value) || 0;
    const kwhCost = parseFloat(container.querySelector("#miningElectricityCost").value) || 0;
    const poolFee = parseFloat(container.querySelector("#miningPoolFee").value) || 0;
    const hardwareCost = parseFloat(container.querySelector("#miningHardwareCost").value) || 0;

    let hashTH = rawHash;
    if (unit === "GH") hashTH = rawHash / 1000.0;
    else if (unit === "EH") hashTH = rawHash * 1000000.0;

    // Real-world network metrics (Post-2024 halving: 3.125 BTC reward, ~650 EH/s network hashrate)
    // 1 TH/s yields approximately 0.00000055 BTC/day under ~650 EH/s network difficulty
    const btcPerThDaily = 0.00000055;
    const grossBtcDaily = (hashTH * btcPerThDaily) * (1 - (poolFee / 100.0));
    const grossBtcMonthly = grossBtcDaily * 30.416;
    const grossBtcYearly = grossBtcDaily * 365;

    const activeSpot = baseBtcPriceUSD * getRateMultiplier();
    const dailyRevenue = grossBtcDaily * activeSpot;
    const monthlyRevenue = grossBtcMonthly * activeSpot;
    const yearlyRevenue = grossBtcYearly * activeSpot;

    const dailyKwh = (powerWatts * 24) / 1000.0;
    const dailyPowerCost = dailyKwh * kwhCost * getRateMultiplier();
    const monthlyPowerCost = dailyPowerCost * 30.416;
    const yearlyPowerCost = dailyPowerCost * 365;

    const dailyNetProfit = dailyRevenue - dailyPowerCost;
    const monthlyNetProfit = monthlyRevenue - monthlyPowerCost;
    const yearlyNetProfit = yearlyRevenue - yearlyPowerCost;

    // Break-even BTC spot price
    const breakEvenBtcPrice = grossBtcDaily > 0 ? (dailyPowerCost / grossBtcDaily) : 0;
    const paybackDays = dailyNetProfit > 0 ? Math.round((hardwareCost * getRateMultiplier()) / dailyNetProfit) : 0;

    const sym = currencySymbols[currentCurrency] || "$";
    const isProfitable = dailyNetProfit > 0;

    const resArea = container.querySelector("#btcMiningResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              Estimated Monthly Net Mining Profit
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; color: ${isProfitable ? '#10b981' : '#ef4444'}; margin-top: 0.25rem;">
              ${isProfitable ? '+' : ''}${sym}${monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.95rem; font-weight: 700; color: ${isProfitable ? '#10b981' : '#ef4444'};">
              ${isProfitable ? '🟢 Profitable Operation' : '🔴 Unprofitable at current electricity price'}
            </div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: right;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">Break-Even BTC Price:</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #ea580c;">
              ${sym}${breakEvenBtcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Current: ${sym}${activeSpot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Daily BTC Output</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #ea580c; margin-top: 0.25rem;">
              ${grossBtcDaily.toFixed(8)} BTC
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${Math.round(grossBtcDaily * SATS_PER_BTC).toLocaleString()} sats/day</div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Electricity Cost</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #ef4444; margin-top: 0.25rem;">
              ${sym}${monthlyPowerCost.toFixed(2)} / mo
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${dailyKwh.toFixed(1)} kWh / day</div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Yearly Projected Net</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: ${yearlyNetProfit >= 0 ? '#10b981' : '#ef4444'}; margin-top: 0.25rem;">
              ${yearlyNetProfit >= 0 ? '+' : ''}${sym}${yearlyNetProfit.toFixed(2)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${grossBtcYearly.toFixed(5)} BTC mined/yr</div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Hardware ROI Payback</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${paybackDays > 0 ? `${paybackDays} Days (~${(paybackDays / 30.4).toFixed(1)} mo)` : 'N/A'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Based on hardware input</div>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // Interactive SVG Multi-Timeframe Trend Curve Generator
  // =========================================================================
  function renderInteractiveChart() {
    const containerEl = container.querySelector("#btcChartSvgContainer");
    if (!containerEl) return;

    // Historical Bitcoin Price Trends (in USD)
    const priceSeriesUSD = {
      "24H": [94200, 94800, 94500, 95100, 95800, 95400, 96100, 96450],
      "7D": [91500, 92800, 92200, 94100, 93800, 95600, 96450],
      "1M": [78500, 82400, 86100, 89500, 93200, 91800, 96450],
      "6M": [58200, 63500, 61000, 68400, 74200, 88500, 96450],
      "1Y": [38500, 44200, 52100, 64500, 67800, 72400, 96450],
      "ALL": [10, 250, 1150, 6500, 19800, 29000, 68900, 96450]
    };

    const pointsUSD = priceSeriesUSD[activeChartPeriod] || priceSeriesUSD["1M"];
    const multiplier = getRateMultiplier();
    const convertedPoints = pointsUSD.map(p => p * multiplier);
    const sym = currencySymbols[currentCurrency] || "$";

    const width = 680;
    const height = 240;
    const padX = 45;
    const padY = 30;

    const minVal = Math.min(...convertedPoints) * 0.96;
    const maxVal = Math.max(...convertedPoints) * 1.04;

    const scaleX = (idx) => padX + (idx / (convertedPoints.length - 1)) * (width - padX * 2);
    const scaleY = (val) => height - padY - ((val - minVal) / (maxVal - minVal)) * (height - padY * 2);

    let pathD = `M ${scaleX(0)} ${scaleY(convertedPoints[0])}`;
    for (let i = 1; i < convertedPoints.length; i++) {
      const prevX = scaleX(i - 1);
      const prevY = scaleY(convertedPoints[i - 1]);
      const currX = scaleX(i);
      const currY = scaleY(convertedPoints[i]);
      const cpX1 = prevX + (currX - prevX) / 2;
      const cpX2 = prevX + (currX - prevX) / 2;
      pathD += ` C ${cpX1} ${prevY}, ${cpX2} ${currY}, ${currX} ${currY}`;
    }

    const areaD = `${pathD} L ${scaleX(convertedPoints.length - 1)} ${height - padY} L ${scaleX(0)} ${height - padY} Z`;

    const svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block; overflow: visible;">
        <defs>
          <linearGradient id="btcAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f7931a" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#ea580c" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="var(--border-color)" stroke-dasharray="4" stroke-opacity="0.5" />
        <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" stroke="var(--border-color)" stroke-dasharray="4" stroke-opacity="0.5" />
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="var(--border-color)" stroke-opacity="0.8" />

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#btcAreaGrad)" />

        <!-- Line Curve -->
        <path d="${pathD}" fill="none" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Point Dots -->
        ${convertedPoints.map((p, idx) => `
          <circle cx="${scaleX(idx)}" cy="${scaleY(p)}" r="4" fill="#f7931a" stroke="#ffffff" stroke-width="2" />
        `).join("")}

        <!-- Labels -->
        <text x="${padX}" y="${height - 10}" fill="var(--text-muted)" font-size="11">Start of Period</text>
        <text x="${width - padX}" y="${height - 10}" fill="var(--text-muted)" font-size="11" text-anchor="end">Live Market Today</text>
        <text x="${padX}" y="${padY - 8}" fill="#10b981" font-weight="700" font-size="12">High: ${sym}${Math.max(...convertedPoints).toLocaleString(undefined, { maximumFractionDigits: 0 })}</text>
        <text x="${width - padX}" y="${padY - 8}" fill="#ef4444" font-weight="700" font-size="12" text-anchor="end">Low: ${sym}${Math.min(...convertedPoints).toLocaleString(undefined, { maximumFractionDigits: 0 })}</text>
      </svg>
    `;

    containerEl.innerHTML = svgHtml;
  }

  // =========================================================================
  // Live Candlestick Controller (1m to 1M Intervals via TradingView Feed)
  // =========================================================================
  const tfDisplayLabels = {
    "1": "1 Minute (1m)",
    "5": "5 Minutes (5m)",
    "15": "15 Minutes (15m)",
    "30": "30 Minutes (30m)",
    "60": "1 Hour (1h)",
    "240": "4 Hours (4h)",
    "D": "1 Day (1D)",
    "W": "1 Week (1W)",
    "M": "1 Month (1M)"
  };

  function getAppTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
      document.body.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDark ? "dark" : "light";
  }

  function loadCandlestickChart(interval = currentCandleInterval) {
    const iframe = container.querySelector("#btcCandleIframe");
    const placeholder = container.querySelector("#btcCandleLoadingPlaceholder");
    if (!iframe) return;

    currentCandleInterval = interval;
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.style.opacity = "1";
    }

    const theme = getAppTheme();
    const isDark = theme === "dark";

    const params = new URLSearchParams({
      symbol: "BINANCE:BTCUSDT",
      interval: interval,
      timezone: "Etc/UTC",
      theme: theme,
      style: "1", // Candlestick bars
      locale: "en",
      toolbar_bg: isDark ? "#131722" : "#f1f3f6",
      enable_publishing: "false",
      hide_side_toolbar: "false",
      allow_symbol_change: "false",
      save_image: "true",
      container_id: "tradingview_btc_candlestick",
      withdateranges: "true",
      hide_legend: "false"
    });

    iframe.src = `https://s.tradingview.com/widgetembed/?${params.toString()}`;

    iframe.onload = () => {
      isCandleChartLoaded = true;
      if (placeholder) {
        placeholder.style.opacity = "0";
        setTimeout(() => {
          placeholder.style.display = "none";
        }, 300);
      }
    };

    const tfLabelEl = container.querySelector("#btcChartActiveTfLabel");
    if (tfLabelEl) {
      tfLabelEl.textContent = tfDisplayLabels[interval] || `${interval}`;
    }
  }

  // Mode Switcher (Candlestick vs Curve)
  const btnBtcModeCandle = container.querySelector("#btnBtcModeCandle");
  const btnBtcModeCurve = container.querySelector("#btnBtcModeCurve");
  const btcCandleToolbar = container.querySelector("#btcCandleToolbar");
  const btcCurveToolbar = container.querySelector("#btcCurveToolbar");
  const btcCandleFrameContainer = container.querySelector("#btcCandleFrameContainer");
  const btcSvgCurveContainer = container.querySelector("#btcChartSvgContainer");

  if (btnBtcModeCandle && btnBtcModeCurve) {
    btnBtcModeCandle.addEventListener("click", () => {
      currentChartMode = "candle";
      btnBtcModeCandle.classList.add("active");
      btnBtcModeCurve.classList.remove("active");
      btcCandleToolbar.style.display = "flex";
      btcCurveToolbar.style.display = "none";
      btcCandleFrameContainer.style.display = "block";
      btcSvgCurveContainer.style.display = "none";

      if (!isCandleChartLoaded) {
        loadCandlestickChart(currentCandleInterval);
      }
    });

    btnBtcModeCurve.addEventListener("click", () => {
      currentChartMode = "curve";
      btnBtcModeCurve.classList.add("active");
      btnBtcModeCandle.classList.remove("active");
      btcCandleToolbar.style.display = "none";
      btcCurveToolbar.style.display = "flex";
      btcCandleFrameContainer.style.display = "none";
      btcSvgCurveContainer.style.display = "block";
      renderInteractiveChart();
    });
  }

  // Chart Collapse / Expand Toggle
  const btnToggleBtcChartCollapse = container.querySelector("#btnToggleBtcChartCollapse");
  const btcChartCollapsibleBody = container.querySelector("#btcChartCollapsibleBody");
  if (btnToggleBtcChartCollapse && btcChartCollapsibleBody) {
    btnToggleBtcChartCollapse.addEventListener("click", () => {
      isChartExpanded = !isChartExpanded;
      if (isChartExpanded) {
        btcChartCollapsibleBody.style.display = "block";
        btnToggleBtcChartCollapse.textContent = "▲ Hide Chart";
      } else {
        btcChartCollapsibleBody.style.display = "none";
        btnToggleBtcChartCollapse.textContent = "▼ Show Live Chart";
      }
    });
  }

  // Candlestick Timeframe Button Handlers (1m to 1M)
  container.querySelectorAll(".btc-candle-tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".btc-candle-tf-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const interval = btn.getAttribute("data-interval");
      loadCandlestickChart(interval);
    });
  });

  // Reload Candlestick Chart Button
  const btnReloadBtcCandle = container.querySelector("#btnReloadBtcCandle");
  if (btnReloadBtcCandle) {
    btnReloadBtcCandle.addEventListener("click", () => {
      loadCandlestickChart(currentCandleInterval);
      btnReloadBtcCandle.textContent = "✓ Refreshed";
      setTimeout(() => {
        btnReloadBtcCandle.textContent = "🔄 Refresh Feed";
      }, 1500);
    });
  }

  // Curve Period Button Handlers
  container.querySelectorAll(".btc-chart-period-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".btc-chart-period-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeChartPeriod = btn.getAttribute("data-period");
      renderInteractiveChart();
    });
  });

  // Action Button Listeners
  container.querySelector("#btnCalculateBtc").addEventListener("click", calculateConverter);
  container.querySelector("#btnCalculateLumpSum").addEventListener("click", calculateLumpSum);
  container.querySelector("#btnCalculateDca").addEventListener("click", calculateDca);
  container.querySelector("#btnCalculateMining").addEventListener("click", calculateMining);
  container.querySelector("#btnResetBtc").addEventListener("click", () => {
    container.querySelector("#btcQuantityInput").value = "0.05";
    container.querySelector("#btcUnitSelect").value = "BTC";
    container.querySelector("#btcFeeMargin").value = "0.5";
    container.querySelector("#btcFeeVal").textContent = "0.50%";
    calculateConverter();
  });

  // Real-time recalculations on input
  container.querySelector("#btcQuantityInput").addEventListener("input", calculateConverter);
  container.querySelector("#btcUnitSelect").addEventListener("change", calculateConverter);
  container.querySelector("#btcCustomSpotPrice").addEventListener("input", calculateConverter);

  // Initial Execution & Immediate Candlestick Chart Render
  updateTickerUI();
  calculateConverter();
  loadCandlestickChart("1"); // Immediately load live 1m candlestick chart on page load!
}
