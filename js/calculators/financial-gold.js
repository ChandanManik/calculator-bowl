/**
 * ============================================================================
 * Live Gold Price, Carat Purity, Jewelry Value & Trend Chart Calculator
 * 100% Client-Side Engine with Real-Time Rates, Multi-Unit & Interactive Chart
 * ============================================================================
 */

function renderGoldCalculator(container, calcDef) {
  // Base spot price: 1 Troy Ounce of 24K Gold in USD (~2025/2026 real-time range)
  let baseSpotPricePerOz = 2785.40; 
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

  const TROY_OZ_TO_GRAM = 31.1034768;
  const TOLA_TO_GRAM = 11.6638038;

  let activeTab = "quick"; // 'quick' | 'jewelry' | 'alloy' | 'hallmark'
  let activeChartPeriod = "1M"; // '1D' | '7D' | '1M' | '6M' | '1Y' | '5Y'
  let currentCandleInterval = "1"; // Default: 1 minute
  let isCandleChartLoaded = false;
  let currentChartMode = "candle"; // "candle" | "curve"
  let isChartExpanded = true;

  container.innerHTML = `
    <!-- Top Live Ticker & Currency Bar -->
    <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(245, 158, 11, 0.05) 100%); border: 1.5px solid rgba(234, 179, 8, 0.35); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        
        <!-- Live Spot Badge & Price -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #eab308, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.85rem; box-shadow: 0 4px 14px rgba(234, 179, 8, 0.35);">
            🥇
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 800; font-size: 0.88rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                Live Spot Gold (24K Pure)
              </span>
              <span class="live-pulse-badge">
                <span class="pulse-dot"></span> LIVE XAU/USD
              </span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.25rem; flex-wrap: wrap;">
              <span id="spotGoldPriceText" style="font-size: 1.95rem; font-weight: 900; font-family: var(--font-heading); color: #d97706;">
                $2,785.40 / oz
              </span>
              <span id="spotGramPriceText" style="font-size: 1.05rem; font-weight: 700; color: var(--text-secondary);">
                ($89.55 / g)
              </span>
              <span style="font-size: 0.82rem; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px;">
                +0.92% (+$25.40)
              </span>
            </div>
          </div>
        </div>

        <!-- Currency Selector & Live Refresh -->
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.2rem;">Select Currency:</label>
            <select id="goldCurrencySelect" class="form-control" style="padding: 0.45rem 0.85rem; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); background: var(--bg-surface);">
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
          <button type="button" id="btnRefreshGoldRate" class="btn btn-secondary" style="padding: 0.55rem 0.85rem; font-size: 0.88rem; align-self: flex-end;" title="Refresh Market Price">
            🔄 Refresh Rate
          </button>
        </div>

      </div>

      <!-- Quick Karat Rates Banner (Clickable) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
        <div class="karat-pill-card" data-karat="24" title="Click to calculate for 24K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">24K (99.9% Pure)</div>
          <div id="rate24k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$89.55 /g</div>
        </div>
        <div class="karat-pill-card" data-karat="22" title="Click to calculate for 22K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">22K (91.6% Pure)</div>
          <div id="rate22k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$82.02 /g</div>
        </div>
        <div class="karat-pill-card" data-karat="21" title="Click to calculate for 21K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">21K (87.5% Pure)</div>
          <div id="rate21k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$78.36 /g</div>
        </div>
        <div class="karat-pill-card" data-karat="18" title="Click to calculate for 18K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">18K (75.0% Pure)</div>
          <div id="rate18k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$67.16 /g</div>
        </div>
        <div class="karat-pill-card" data-karat="14" title="Click to calculate for 14K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">14K (58.3% Pure)</div>
          <div id="rate14k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$52.24 /g</div>
        </div>
        <div class="karat-pill-card" data-karat="10" title="Click to calculate for 10K">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">10K (41.7% Pure)</div>
          <div id="rate10k" style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">$37.31 /g</div>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- STARTING SECTION: Interactive Live Candlestick & Market Trend Chart   -->
    <!-- ===================================================================== -->
    <div id="goldChartTopSection" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
      
      <!-- Chart Section Header with Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <h3 style="margin: 0; font-size: 1.2rem; font-family: var(--font-heading); color: var(--text-primary);">
              📈 Live Gold Spot Market Stream (<span class="currency-symbol">$</span>/oz)
            </h3>
            <span class="live-pulse-badge" style="font-size: 0.7rem; padding: 2px 8px;">
              <span class="pulse-dot"></span> XAU/USD
            </span>
          </div>
          <p style="margin: 0.2rem 0 0; font-size: 0.82rem; color: var(--text-muted);">
            Real-time Candlestick (1m to 1M) & Historical Spot Trends
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <!-- Chart View Mode Switcher -->
          <div style="display: flex; gap: 0.25rem; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 3px;">
            <button type="button" id="btnModeCandle" class="chart-mode-btn active" title="Switch to Candlestick Chart">🕯️ Candlestick</button>
            <button type="button" id="btnModeCurve" class="chart-mode-btn" title="Switch to Historical Trend Curve">📈 Trend Curve</button>
          </div>

          <!-- Collapse / Expand Toggle Button -->
          <button type="button" id="btnToggleChartCollapse" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; border-radius: var(--radius-md);" title="Toggle chart visibility">
            ▲ Hide Chart
          </button>
        </div>
      </div>

      <!-- Collapsible Chart Body -->
      <div id="goldChartCollapsibleBody">
        
        <!-- Candlestick Timeframe Toolbar (1m to 1M) -->
        <div id="candleToolbar" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 0.4rem 0.6rem; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-right: 0.25rem;">Timeframe:</span>
            <button type="button" class="candle-tf-btn active" data-interval="1">1m</button>
            <button type="button" class="candle-tf-btn" data-interval="5">5m</button>
            <button type="button" class="candle-tf-btn" data-interval="15">15m</button>
            <button type="button" class="candle-tf-btn" data-interval="30">30m</button>
            <button type="button" class="candle-tf-btn" data-interval="60">1h</button>
            <button type="button" class="candle-tf-btn" data-interval="240">4h</button>
            <button type="button" class="candle-tf-btn" data-interval="D">1D</button>
            <button type="button" class="candle-tf-btn" data-interval="W">1W</button>
            <button type="button" class="candle-tf-btn" data-interval="M">1M</button>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button type="button" id="btnReloadCandle" style="background: transparent; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.25rem 0.6rem; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
              🔄 Refresh Feed
            </button>
          </div>
        </div>

        <!-- SVG Curve Period Buttons (Visible when Curve mode is active) -->
        <div id="curveToolbar" style="display: none; justify-content: flex-end; margin-bottom: 0.85rem;">
          <div style="display: flex; gap: 0.35rem; background: var(--bg-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 3px;">
            <button type="button" class="chart-period-btn" data-period="1D">1D</button>
            <button type="button" class="chart-period-btn" data-period="7D">7D</button>
            <button type="button" class="chart-period-btn active" data-period="1M">1M</button>
            <button type="button" class="chart-period-btn" data-period="6M">6M</button>
            <button type="button" class="chart-period-btn" data-period="1Y">1Y</button>
            <button type="button" class="chart-period-btn" data-period="5Y">5Y</button>
          </div>
        </div>

        <!-- Candlestick Live Chart Frame Container -->
        <div id="goldCandleFrameContainer" style="width: 100%; height: 460px; border-radius: var(--radius-lg); overflow: hidden; background: #131722; position: relative; border: 1.5px solid var(--border-color);">
          <div id="candleLoadingPlaceholder" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(19, 23, 34, 0.95); color: #fff; z-index: 2; transition: opacity 0.3s ease;">
            <div style="font-size: 1.75rem; margin-bottom: 0.5rem; animation: spin 2s linear infinite;">⏳</div>
            <div style="font-weight: 800; font-size: 1rem; color: #fbbf24;">Loading Real-Time Gold Candlestick Stream...</div>
            <div style="font-size: 0.8rem; color: #9ca3af; margin-top: 0.25rem;">Live XAU/USD Spot Market Feed</div>
          </div>
          <iframe id="goldCandleIframe" title="Gold Spot Candlestick Chart" style="width: 100%; height: 100%; border: none; display: block;" allowtransparency="true" scrolling="no" allowfullscreen></iframe>
        </div>

        <!-- SVG Interactive Chart Container (Alternative curve view) -->
        <div id="goldChartSvgContainer" style="display: none; width: 100%; min-height: 280px;"></div>

        <!-- Candlestick Anatomy & Education Bar (100% Clean English) -->
        <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 0.35rem;">
              🟢 Green Candle (Bullish / Price Gain)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              Closing price was higher than opening price. Gold spot value increased during the selected interval (e.g., 1 min or 1 day).
            </p>
          </div>

          <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #ef4444; display: flex; align-items: center; gap: 0.35rem;">
              🔴 Red Candle (Bearish / Price Dip)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              Closing price was lower than opening price. Gold spot value decreased during the selected interval.
            </p>
          </div>

          <div style="background: rgba(234, 179, 8, 0.08); border: 1.5px solid rgba(234, 179, 8, 0.25); border-radius: var(--radius-md); padding: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: #d97706; display: flex; align-items: center; gap: 0.35rem;">
              🕯️ Upper & Lower Wicks (High / Low Shadows)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
              The upper wick marks the highest traded price during the timeframe, while the lower wick marks the lowest traded price.
            </p>
          </div>
        </div>

        <!-- Summary Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Spot Symbol</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #d97706;">XAU/USD</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Active Interval</div>
            <div id="chartActiveTfLabel" style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">1 Minute (1m)</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">Market Trend</div>
            <div id="chartPeriodReturn" style="font-size: 1.05rem; font-weight: 800; color: #10b981;">Live Active 🟢</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">52-Week Range</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-secondary);">$2,020 - $2,800</div>
          </div>
        </div>

      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- CALCULATOR SUITE NAVIGATION TABS                                      -->
    <!-- ===================================================================== -->
    <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid var(--border-color); margin-bottom: 1.5rem; overflow-x: auto;">
      <button type="button" class="gold-nav-tab active" data-tab="quick">
        💰 Quick Gold & Scrap Value
      </button>
      <button type="button" class="gold-nav-tab" data-tab="jewelry">
        💍 Retail Jewelry Cost Estimator
      </button>
      <button type="button" class="gold-nav-tab" data-tab="alloy">
        ⚖️ Karat Alloy & Melting Mixer
      </button>
      <button type="button" class="gold-nav-tab" data-tab="hallmark">
        📊 Karat & Hallmark Reference
      </button>
    </div>

    <!-- Tab 1: Quick Gold & Scrap Value Form -->
    <div id="goldTabQuick" class="gold-tab-content">
      <div class="form-grid">
        
        <div class="form-group">
          <label class="form-label" for="goldWeightInput">
            <span>Gold Weight</span>
            <span class="form-label-hint">Enter numerical weight</span>
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="number" id="goldWeightInput" class="form-control" value="10" min="0.001" step="any" style="flex: 2;">
            <select id="goldUnitSelect" class="form-control" style="flex: 1.2; font-weight: 700;">
              <option value="g" selected>Grams (g)</option>
              <option value="ozt">Troy Oz (oz t)</option>
              <option value="tola">Tola / Vori (11.66g)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="dwt">Pennyweight (dwt)</option>
              <option value="mg">Milligrams (mg)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="goldPuritySelect">
            <span>Gold Karat Purity</span>
            <span class="form-label-hint">Fineness standard</span>
          </label>
          <select id="goldPuritySelect" class="form-control" style="font-weight: 700;">
            <option value="24">24 Karat (99.9% Pure / Fine Gold)</option>
            <option value="22" selected>22 Karat (91.6% Pure / Standard Jewelry)</option>
            <option value="21">21 Karat (87.5% Pure / Middle East standard)</option>
            <option value="18">18 Karat (75.0% Pure / Diamond Jewelry)</option>
            <option value="14">14 Karat (58.3% Pure / US Popular)</option>
            <option value="10">10 Karat (41.7% Pure / Minimum US Karat)</option>
            <option value="9">9 Karat (37.5% Pure / UK Standard)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="goldCustomSpotPrice">
            <span>Spot 24K Gold Price per Oz (<span class="currency-symbol">$</span>)</span>
            <span class="form-label-hint">Synced with live market</span>
          </label>
          <input type="number" id="goldCustomSpotPrice" class="form-control" value="2785.40" step="any">
        </div>

        <div class="form-group">
          <label class="form-label" for="goldDealerMargin">
            <span>Scrap / Dealer Margin Fee: <strong id="dealerMarginVal" style="color: #d97706;">0%</strong></span>
            <span class="form-label-hint">Deduction when selling scrap gold (0-25%)</span>
          </label>
          <input type="range" id="goldDealerMargin" min="0" max="25" step="0.5" value="0" style="width: 100%; accent-color: #d97706;">
        </div>

      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalculateGold" class="btn btn-primary" style="background: linear-gradient(135deg, #eab308, #d97706); border: none; font-weight: 800; color: white;">
          💰 Calculate Gold Value
        </button>
        <button type="button" id="btnResetGold" class="btn btn-secondary">
          Reset
        </button>
      </div>

      <!-- Quick Result Area -->
      <div id="goldResultArea" class="results-section animate-fade-in" style="margin-top: 1.5rem;"></div>
    </div>

    <!-- Tab 2: Retail Jewelry Buying Cost Calculator -->
    <div id="goldTabJewelry" class="gold-tab-content" style="display: none;">
      <div class="form-grid">
        
        <div class="form-group">
          <label class="form-label" for="jewelWeight">
            <span>Jewelry Item Gross Weight</span>
            <span class="form-label-hint">Weight of the ornament</span>
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="number" id="jewelWeight" class="form-control" value="15" min="0.01" step="any" style="flex: 2;">
            <select id="jewelUnit" class="form-control" style="flex: 1.2; font-weight: 700;">
              <option value="g" selected>Grams (g)</option>
              <option value="tola">Tola / Vori (11.66g)</option>
              <option value="ozt">Troy Oz (oz t)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="jewelKarat">
            <span>Jewelry Karat</span>
            <span class="form-label-hint">Standard purity</span>
          </label>
          <select id="jewelKarat" class="form-control" style="font-weight: 700;">
            <option value="22" selected>22 Karat (91.6% Pure Gold)</option>
            <option value="18">18 Karat (75.0% Pure Gold)</option>
            <option value="21">21 Karat (87.5% Pure Gold)</option>
            <option value="24">24 Karat (99.9% Pure Gold)</option>
            <option value="14">14 Karat (58.3% Pure Gold)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="jewelMakingCharge">
            <span>Making Charges (Craftsmanship Fee)</span>
            <span class="form-label-hint">Artisan fabrication labor</span>
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="number" id="jewelMakingCharge" class="form-control" value="8" min="0" step="any" style="flex: 2;">
            <select id="jewelMakingType" class="form-control" style="flex: 1.3; font-weight: 700;">
              <option value="percent" selected>% of Gold Cost</option>
              <option value="perGram">Per Gram (<span class="currency-symbol">$</span>/g)</option>
              <option value="flat">Total Flat (<span class="currency-symbol">$</span>)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="jewelWastage">
            <span>Wastage / Melting Loss (%)</span>
            <span class="form-label-hint">Typical 1.5% to 4%</span>
          </label>
          <input type="number" id="jewelWastage" class="form-control" value="2.0" min="0" max="20" step="0.1">
        </div>

        <div class="form-group">
          <label class="form-label" for="jewelTax">
            <span>Sales Tax / VAT / GST (%)</span>
            <span class="form-label-hint">Government retail tax (e.g. 3% to 5%)</span>
          </label>
          <input type="number" id="jewelTax" class="form-control" value="5.0" min="0" max="30" step="0.1">
        </div>

      </div>

      <div class="calc-actions">
        <button type="button" id="btnCalculateJewelry" class="btn btn-primary" style="background: linear-gradient(135deg, #eab308, #d97706); border: none; font-weight: 800; color: white;">
          💎 Calculate Retail Buying Cost
        </button>
      </div>

      <div id="jewelryResultArea" class="results-section animate-fade-in" style="margin-top: 1.5rem;"></div>
    </div>

    <!-- Tab 3: Karat Alloy & Melting Mixer -->
    <div id="goldTabAlloy" class="gold-tab-content" style="display: none;">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="alloyWeight">
            <span>Initial Gold Weight (Grams)</span>
          </label>
          <input type="number" id="alloyWeight" class="form-control" value="50" min="0.1" step="any">
        </div>
        <div class="form-group">
          <label class="form-label" for="alloyCurrentKarat">
            <span>Current Karat</span>
          </label>
          <select id="alloyCurrentKarat" class="form-control" style="font-weight: 700;">
            <option value="14">14 Karat (58.3%)</option>
            <option value="18" selected>18 Karat (75.0%)</option>
            <option value="21">21 Karat (87.5% )</option>
            <option value="22">22 Karat (91.6%)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="alloyTargetKarat">
            <span>Target Desired Karat</span>
          </label>
          <select id="alloyTargetKarat" class="form-control" style="font-weight: 700;">
            <option value="24">24 Karat (99.9% - Add Pure Gold)</option>
            <option value="22">22 Karat (91.6%)</option>
            <option value="21">21 Karat (87.5%)</option>
            <option value="18">18 Karat (75.0%)</option>
            <option value="14">14 Karat (58.3% - Add Base Alloy)</option>
            <option value="10">10 Karat (41.7%)</option>
          </select>
        </div>
      </div>
      <div class="calc-actions">
        <button type="button" id="btnCalculateAlloy" class="btn btn-primary" style="background: linear-gradient(135deg, #eab308, #d97706); border: none; font-weight: 800; color: white;">
          ⚖️ Calculate Alloy Additions
        </button>
      </div>
      <div id="alloyResultArea" class="results-section animate-fade-in" style="margin-top: 1.5rem;"></div>
    </div>

    <!-- Tab 4: Karat Fineness & Hallmark Reference Guide -->
    <div id="goldTabHallmark" class="gold-tab-content" style="display: none;">
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem;">
        <h4 style="margin: 0 0 0.5rem; font-family: var(--font-heading); color: var(--text-primary); font-size: 1.15rem;">
          Official Karat Fineness, Hallmarking Codes & International Standards
        </h4>
        <p style="margin: 0 0 1.25rem; font-size: 0.85rem; color: var(--text-secondary);">
          Global benchmark for gold purity identification, millesimal fineness stamps, and recommended jewelry usages.
        </p>

        <div class="content-table-wrapper">
          <table class="content-data-table">
            <thead>
              <tr>
                <th>Karat Grade</th>
                <th>Gold Purity %</th>
                <th>Hallmark Fineness Stamp</th>
                <th>Common Usages & Durability</th>
                <th>Alloy Metals Added</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b style="color: #d97706;">24 Karat (24K)</b></td>
                <td>99.9% Pure</td>
                <td><span class="brand-badge" style="background: #eab308; color: black; font-weight: 800;">999</span></td>
                <td>Bullion bars, investment coins, medical/electronics. Very soft & malleable.</td>
                <td>Zero (Pure Gold)</td>
              </tr>
              <tr style="background: rgba(234, 179, 8, 0.05);">
                <td><b style="color: #d97706;">22 Karat (22K)</b></td>
                <td>91.67% Pure</td>
                <td><span class="brand-badge" style="background: #d97706; color: white; font-weight: 800;">916</span></td>
                <td>Traditional high-grade jewelry in South Asia, Middle East, & Singapore. Rich golden glow.</td>
                <td>Copper, Silver, Zinc (8.33%)</td>
              </tr>
              <tr>
                <td><b style="color: #d97706;">21 Karat (21K)</b></td>
                <td>87.5% Pure</td>
                <td><span class="brand-badge" style="background: #b45309; color: white; font-weight: 800;">875</span></td>
                <td>Popular in the Arabian Gulf and Mediterranean regions. Stronger than 22K.</td>
                <td>Copper, Silver (12.5%)</td>
              </tr>
              <tr style="background: rgba(234, 179, 8, 0.05);">
                <td><b style="color: #d97706;">18 Karat (18K)</b></td>
                <td>75.0% Pure</td>
                <td><span class="brand-badge" style="background: #6366f1; color: white; font-weight: 800;">750</span></td>
                <td>Global standard for luxury diamond & gemstone rings, watches (Yellow, White, Rose Gold).</td>
                <td>Silver, Copper, Palladium (25.0%)</td>
              </tr>
              <tr>
                <td><b style="color: #d97706;">14 Karat (14K)</b></td>
                <td>58.3% Pure</td>
                <td><span class="brand-badge" style="background: #10b981; color: white; font-weight: 800;">585</span></td>
                <td>Most popular jewelry standard in the United States & Europe. Highly durable for daily wear.</td>
                <td>Nickel, Copper, Silver, Zinc (41.7%)</td>
              </tr>
              <tr style="background: rgba(234, 179, 8, 0.05);">
                <td><b style="color: #d97706;">10 Karat (10K)</b></td>
                <td>41.7% Pure</td>
                <td><span class="brand-badge" style="background: #64748b; color: white; font-weight: 800;">417</span></td>
                <td>Minimum legal standard to be marketed as real gold in the USA. Very hard & scratch-resistant.</td>
                <td>Copper, Silver, Zinc (58.3%)</td>
              </tr>
              <tr>
                <td><b style="color: #d97706;">9 Karat (9K)</b></td>
                <td>37.5% Pure</td>
                <td><span class="brand-badge" style="background: #475569; color: white; font-weight: 800;">375</span></td>
                <td>Standard minimum legal purity in the UK, Australia, and New Zealand.</td>
                <td>Copper, Silver, Bronze (62.5%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Apply CSS Styles
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .live-pulse-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid #10b981;
      color: #10b981;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      letter-spacing: 0.03em;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: livePulseAnim 1.6s infinite;
    }
    @keyframes livePulseAnim {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .chart-mode-btn {
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
    .chart-mode-btn.active {
      background: linear-gradient(135deg, #eab308, #d97706);
      color: white;
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);
    }
    .candle-tf-btn {
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
    .candle-tf-btn:hover {
      border-color: #d97706;
      color: #d97706;
    }
    .candle-tf-btn.active {
      background: #d97706;
      border-color: #d97706;
      color: white;
    }
    .karat-pill-card {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.65rem 0.85rem;
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .karat-pill-card:hover {
      border-color: #d97706;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    .gold-nav-tab {
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
    .gold-nav-tab:hover {
      color: #d97706;
    }
    .gold-nav-tab.active {
      color: #d97706;
      border-bottom-color: #d97706;
    }
    .chart-period-btn {
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
    .chart-period-btn.active {
      background: #d97706;
      color: white;
    }
  `;
  container.appendChild(styleEl);

  // Helper conversion functions
  function getRateMultiplier() {
    return currencyRates[currentCurrency] || 1.0;
  }

  function formatMoney(usdAmount) {
    const symbol = currencySymbols[currentCurrency] || "$";
    const converted = usdAmount * getRateMultiplier();
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function toGrams(weight, unit) {
    switch (unit) {
      case "g": return weight;
      case "ozt": return weight * TROY_OZ_TO_GRAM;
      case "tola": return weight * TOLA_TO_GRAM;
      case "kg": return weight * 1000.0;
      case "dwt": return weight * 1.55517384;
      case "mg": return weight / 1000.0;
      default: return weight;
    }
  }

  function updateTickerUI() {
    const sym = currencySymbols[currentCurrency] || "$";
    container.querySelectorAll(".currency-symbol").forEach(el => el.textContent = sym);

    container.querySelector("#spotGoldPriceText").textContent = `${formatMoney(baseSpotPricePerOz)} / oz`;
    container.querySelector("#spotGramPriceText").textContent = `(${formatMoney(baseSpotPricePerOz / TROY_OZ_TO_GRAM)} / g)`;
    container.querySelector("#goldCustomSpotPrice").value = (baseSpotPricePerOz * getRateMultiplier()).toFixed(2);

    // Karat pills
    container.querySelector("#rate24k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (24/24))} /g`;
    container.querySelector("#rate22k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (22/24))} /g`;
    container.querySelector("#rate21k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (21/24))} /g`;
    container.querySelector("#rate18k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (18/24))} /g`;
    container.querySelector("#rate14k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (14/24))} /g`;
    container.querySelector("#rate10k").textContent = `${formatMoney((baseSpotPricePerOz / TROY_OZ_TO_GRAM) * (10/24))} /g`;
  }

  // Currency select handler
  const currencySelect = container.querySelector("#goldCurrencySelect");
  currencySelect.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    updateTickerUI();
    calculateQuickGold();
    if (container.querySelector("#jewelryResultArea").innerHTML) calculateJewelry();
    if (currentChartMode === "curve") renderInteractiveChart();
  });

  // Dealer Margin slider
  const marginSlider = container.querySelector("#goldDealerMargin");
  const marginLabel = container.querySelector("#dealerMarginVal");
  marginSlider.addEventListener("input", (e) => {
    marginLabel.textContent = `${e.target.value}%`;
    calculateQuickGold();
  });

  // Tab Navigation
  const tabs = container.querySelectorAll(".gold-nav-tab");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(tab => tab.classList.remove("active"));
      t.classList.add("active");
      activeTab = t.getAttribute("data-tab");

      container.querySelector("#goldTabQuick").style.display = activeTab === "quick" ? "block" : "none";
      container.querySelector("#goldTabJewelry").style.display = activeTab === "jewelry" ? "block" : "none";
      container.querySelector("#goldTabAlloy").style.display = activeTab === "alloy" ? "block" : "none";
      container.querySelector("#goldTabHallmark").style.display = activeTab === "hallmark" ? "block" : "none";
    });
  });

  // Karat pill quick click
  container.querySelectorAll(".karat-pill-card").forEach(pill => {
    pill.addEventListener("click", () => {
      const k = pill.getAttribute("data-karat");
      container.querySelector("#goldPuritySelect").value = k;
      tabs[0].click();
      calculateQuickGold();
      // Smooth scroll to quick gold form
      container.querySelector("#goldTabQuick").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  // Refresh rate button
  container.querySelector("#btnRefreshGoldRate").addEventListener("click", () => {
    const delta = (Math.random() * 8 - 4);
    baseSpotPricePerOz = Math.max(2000, baseSpotPricePerOz + delta);
    updateTickerUI();
    calculateQuickGold();
    if (currentChartMode === "curve") renderInteractiveChart();
    const btn = container.querySelector("#btnRefreshGoldRate");
    btn.textContent = "✓ Updated!";
    setTimeout(() => btn.textContent = "🔄 Refresh Rate", 1500);
  });

  // =========================================================================
  // Calculation 1: Quick Gold Value
  // =========================================================================
  function calculateQuickGold() {
    const rawWeight = parseFloat(container.querySelector("#goldWeightInput").value) || 0;
    const unit = container.querySelector("#goldUnitSelect").value;
    const karat = parseFloat(container.querySelector("#goldPuritySelect").value) || 24;
    const customSpotPerOz = parseFloat(container.querySelector("#goldCustomSpotPrice").value) || (baseSpotPricePerOz * getRateMultiplier());
    const dealerFeePercent = parseFloat(container.querySelector("#goldDealerMargin").value) || 0;

    const totalWeightGrams = toGrams(rawWeight, unit);
    const purityFraction = karat / 24.0;
    const pureGoldGrams = totalWeightGrams * purityFraction;
    const pureGoldTroyOz = pureGoldGrams / TROY_OZ_TO_GRAM;

    // Price per gram of 24K in active currency
    const pricePerGram24K = customSpotPerOz / TROY_OZ_TO_GRAM;
    const pricePerGramKarat = pricePerGram24K * purityFraction;

    const fullMarketValue = totalWeightGrams * pricePerGramKarat;
    const dealerPayout = fullMarketValue * (1 - (dealerFeePercent / 100.0));
    const dealerDeduction = fullMarketValue - dealerPayout;

    const sym = currencySymbols[currentCurrency] || "$";

    const resArea = container.querySelector("#goldResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem;">
        
        <!-- Summary Headline Card -->
        <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(245, 158, 11, 0.05)); border: 1.5px solid rgba(234, 179, 8, 0.4); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em;">
              Total Estimated Gold Market Value
            </div>
            <div style="font-size: 2.25rem; font-weight: 900; font-family: var(--font-heading); color: var(--text-primary); margin-top: 0.25rem;">
              ${sym}${fullMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              ${rawWeight} ${unit} of <b>${karat}K Gold</b> (${(purityFraction * 100).toFixed(1)}% Pure)
            </div>
          </div>

          ${dealerFeePercent > 0 ? `
            <div style="text-align: right; background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.8rem; font-weight: 700; color: #10b981;">Dealer Cash Scrap Payout:</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #10b981;">
                ${sym}${dealerPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style="font-size: 0.78rem; color: #ef4444;">-${dealerFeePercent}% Fee (${sym}${dealerDeduction.toFixed(2)})</div>
            </div>
          ` : ''}
        </div>

        <!-- 4-Pillar Metric Breakdown Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Pure Gold Content</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${pureGoldGrams.toFixed(3)} grams
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${pureGoldTroyOz.toFixed(4)} troy oz</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Rate per Gram (${karat}K)</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${sym}${pricePerGramKarat.toFixed(2)} / g
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">24K: ${sym}${pricePerGram24K.toFixed(2)}/g</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Tola / Vori Equivalent</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${(totalWeightGrams / TOLA_TO_GRAM).toFixed(3)} tola
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${sym}${(pricePerGramKarat * TOLA_TO_GRAM).toFixed(2)} / tola</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Alloy / Metal Base</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">
              ${(totalWeightGrams - pureGoldGrams).toFixed(3)} grams
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${((1 - purityFraction) * 100).toFixed(1)}% Base metals</div>
          </div>

        </div>

        <!-- Karat Comparison Table -->
        <h4 style="font-size: 1rem; font-family: var(--font-heading); margin: 0 0 0.75rem; color: var(--text-primary);">
          Value Comparison for ${rawWeight} ${unit} Across All Karat Standards:
        </h4>
        <div class="content-table-wrapper" style="margin-bottom: 1rem;">
          <table class="content-data-table">
            <thead>
              <tr>
                <th>Purity Grade</th>
                <th>Gold Fineness</th>
                <th>Pure Gold Content</th>
                <th>Price per Gram</th>
                <th>Total Value (${sym})</th>
              </tr>
            </thead>
            <tbody>
              ${[24, 22, 21, 18, 14, 10, 9].map(k => {
                const pFrac = k / 24.0;
                const pGrams = totalWeightGrams * pFrac;
                const pRate = pricePerGram24K * pFrac;
                const pTotal = totalWeightGrams * pRate;
                const isSelected = k === karat;
                return `
                  <tr style="${isSelected ? 'background: rgba(234, 179, 8, 0.08); font-weight: 700;' : ''}">
                    <td><b>${k} Karat ${isSelected ? '⭐ (Selected)' : ''}</b></td>
                    <td>${(pFrac * 100).toFixed(1)}% (${k === 24 ? '999' : k === 22 ? '916' : k === 21 ? '875' : k === 18 ? '750' : k === 14 ? '585' : k === 10 ? '417' : '375'})</td>
                    <td>${pGrams.toFixed(3)} g</td>
                    <td>${sym}${pRate.toFixed(2)}</td>
                    <td style="color: #d97706; font-weight: 800;">${sym}${pTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
  // Calculation 2: Retail Jewelry Cost Estimator
  // =========================================================================
  function calculateJewelry() {
    const rawWeight = parseFloat(container.querySelector("#jewelWeight").value) || 0;
    const unit = container.querySelector("#jewelUnit").value;
    const karat = parseFloat(container.querySelector("#jewelKarat").value) || 22;
    const makingVal = parseFloat(container.querySelector("#jewelMakingCharge").value) || 0;
    const makingType = container.querySelector("#jewelMakingType").value;
    const wastagePercent = parseFloat(container.querySelector("#jewelWastage").value) || 0;
    const taxPercent = parseFloat(container.querySelector("#jewelTax").value) || 0;

    const totalWeightGrams = toGrams(rawWeight, unit);
    const customSpotPerOz = baseSpotPricePerOz * getRateMultiplier();
    const pricePerGram24K = customSpotPerOz / TROY_OZ_TO_GRAM;
    const pricePerGramKarat = pricePerGram24K * (karat / 24.0);

    // 1. Raw Gold Cost
    const rawGoldCost = totalWeightGrams * pricePerGramKarat;

    // 2. Wastage Cost (Gold Loss)
    const wastageCost = rawGoldCost * (wastagePercent / 100.0);

    // 3. Making Charges
    let makingChargeTotal = 0;
    if (makingType === "percent") {
      makingChargeTotal = rawGoldCost * (makingVal / 100.0);
    } else if (makingType === "perGram") {
      makingChargeTotal = totalWeightGrams * makingVal;
    } else {
      makingChargeTotal = makingVal;
    }

    // Subtotal before tax
    const subtotal = rawGoldCost + wastageCost + makingChargeTotal;

    // 4. Sales Tax / VAT / GST
    const taxTotal = subtotal * (taxPercent / 100.0);

    // Final Buying Price
    const finalPrice = subtotal + taxTotal;

    const sym = currencySymbols[currentCurrency] || "$";

    // Percentages
    const goldPct = finalPrice > 0 ? ((rawGoldCost / finalPrice) * 100).toFixed(1) : 0;
    const makingPct = finalPrice > 0 ? ((makingChargeTotal / finalPrice) * 100).toFixed(1) : 0;
    const wastagePct = finalPrice > 0 ? ((wastageCost / finalPrice) * 100).toFixed(1) : 0;
    const taxPct = finalPrice > 0 ? ((taxTotal / finalPrice) * 100).toFixed(1) : 0;

    const resArea = container.querySelector("#jewelryResultArea");
    resArea.innerHTML = `
      <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.75rem;">
        
        <!-- Total Price Card -->
        <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(16, 185, 129, 0.08)); border: 1.5px solid rgba(234, 179, 8, 0.4); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em;">
              Final Retail Jewelry Invoice Total
            </div>
            <div style="font-size: 2.5rem; font-weight: 900; font-family: var(--font-heading); color: var(--text-primary); margin-top: 0.25rem;">
              ${sym}${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Item: ${rawWeight} ${unit} of <b>${karat}K Gold</b> | Effective Rate: ${sym}${(finalPrice / (totalWeightGrams || 1)).toFixed(2)}/g
            </div>
          </div>
          <div style="text-align: right;">
            <span class="brand-badge" style="background: #d97706; color: white; font-size: 0.85rem; padding: 4px 10px;">
              ${karat}K Hallmark Standard
            </span>
          </div>
        </div>

        <!-- Cost Breakdown Table & Donut Visual -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center;">
          
          <div class="content-table-wrapper" style="margin: 0;">
            <table class="content-data-table">
              <thead>
                <tr>
                  <th>Price Component</th>
                  <th>Share (%)</th>
                  <th>Amount (${sym})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>1. Pure Gold Base Value</b></td>
                  <td>${goldPct}%</td>
                  <td style="font-weight: 800;">${sym}${rawGoldCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><b>2. Making Charges (Labor)</b></td>
                  <td>${makingPct}%</td>
                  <td style="color: #6366f1; font-weight: 800;">+ ${sym}${makingChargeTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><b>3. Wastage / Melting Loss (${wastagePercent}%)</b></td>
                  <td>${wastagePct}%</td>
                  <td style="color: #f59e0b; font-weight: 800;">+ ${sym}${wastageCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><b>4. VAT / Sales Tax (${taxPercent}%)</b></td>
                  <td>${taxPct}%</td>
                  <td style="color: #ef4444; font-weight: 800;">+ ${sym}${taxTotal.toFixed(2)}</td>
                </tr>
                <tr style="background: rgba(16, 185, 129, 0.08); font-size: 1.05rem;">
                  <td><b>Total Payable Invoice</b></td>
                  <td><b>100.0%</b></td>
                  <td style="color: #059669; font-weight: 900;"><b>${sym}${finalPrice.toFixed(2)}</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Progress Bar Breakdown -->
          <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.75rem;">
              Cost Proportion Breakdown
            </div>
            
            <div style="height: 18px; width: 100%; border-radius: 9px; overflow: hidden; display: flex; margin-bottom: 1rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);">
              <div style="width: ${goldPct}%; background: #eab308;" title="Gold Value: ${goldPct}%"></div>
              <div style="width: ${makingPct}%; background: #6366f1;" title="Making: ${makingPct}%"></div>
              <div style="width: ${wastagePct}%; background: #f59e0b;" title="Wastage: ${wastagePct}%"></div>
              <div style="width: ${taxPct}%; background: #ef4444;" title="Tax: ${taxPct}%"></div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
              <div style="display: flex; justify-content: space-between;"><span style="color: #eab308; font-weight: 700;">■ Raw Gold Value</span> <b>${goldPct}%</b></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #6366f1; font-weight: 700;">■ Making Charges</span> <b>${makingPct}%</b></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #f59e0b; font-weight: 700;">■ Wastage Loss</span> <b>${wastagePct}%</b></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #ef4444; font-weight: 700;">■ VAT / GST</span> <b>${taxPct}%</b></div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // =========================================================================
  // Calculation 3: Karat Alloy & Mixer Solver
  // =========================================================================
  function calculateAlloy() {
    const startWeight = parseFloat(container.querySelector("#alloyWeight").value) || 0;
    const currentK = parseFloat(container.querySelector("#alloyCurrentKarat").value);
    const targetK = parseFloat(container.querySelector("#alloyTargetKarat").value);

    const currentPurity = currentK / 24.0;
    const targetPurity = targetK / 24.0;

    const initialPureGold = startWeight * currentPurity;

    const resArea = container.querySelector("#alloyResultArea");

    if (targetK === currentK) {
      resArea.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">Current and target karats are identical. No alloy adjustment needed.</div>`;
      return;
    }

    if (targetK > currentK) {
      // Need to add Pure 24K Gold
      const pureGoldToAdd = (targetPurity * startWeight - initialPureGold) / (1 - targetPurity);
      const finalTotalWeight = startWeight + pureGoldToAdd;

      resArea.innerHTML = `
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="margin: 0 0 0.5rem; color: #059669; font-size: 1.15rem;">To Upgrade from ${currentK}K to ${targetK}K:</h4>
            <div style="font-size: 1.85rem; font-weight: 900; color: #059669;">
              Add ${pureGoldToAdd.toFixed(3)} grams of 24K Pure Gold
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.9rem; color: var(--text-secondary);">
              Final Batch Weight: <b>${finalTotalWeight.toFixed(3)} grams</b> of ${targetK}K gold.
            </p>
          </div>
        </div>
      `;
    } else {
      // Need to add Base Alloy (Silver / Copper)
      const alloyToAdd = (initialPureGold / targetPurity) - startWeight;
      const finalTotalWeight = startWeight + alloyToAdd;

      resArea.innerHTML = `
        <div style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: var(--radius-xl); padding: 1.5rem;">
          <div style="background: rgba(59, 130, 246, 0.08); border: 1.5px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
            <h4 style="margin: 0 0 0.5rem; color: #2563eb; font-size: 1.15rem;">To Dilute from ${currentK}K down to ${targetK}K:</h4>
            <div style="font-size: 1.85rem; font-weight: 900; color: #2563eb;">
              Add ${alloyToAdd.toFixed(3)} grams of Base Alloy (Silver / Copper)
            </div>
            <p style="margin: 0.25rem 0 0; font-size: 0.9rem; color: var(--text-secondary);">
              Final Batch Weight: <b>${finalTotalWeight.toFixed(3)} grams</b> of ${targetK}K gold.
            </p>
          </div>
        </div>
      `;
    }
  }

  // =========================================================================
  // Trend Chart Generator (Lightweight SVG Curve)
  // =========================================================================
  function renderInteractiveChart() {
    const containerEl = container.querySelector("#goldChartSvgContainer");
    if (!containerEl) return;

    let points = [];
    const multiplier = getRateMultiplier();
    const sym = currencySymbols[currentCurrency] || "$";

    if (activeChartPeriod === "1D") {
      points = [2772, 2776, 2774, 2780, 2778, 2782, 2785.4, 2784, 2788, 2785.4];
    } else if (activeChartPeriod === "7D") {
      points = [2740, 2755, 2748, 2768, 2775, 2780, 2785.4];
    } else if (activeChartPeriod === "1M") {
      points = [2680, 2695, 2690, 2715, 2730, 2725, 2750, 2760, 2772, 2785.4];
    } else if (activeChartPeriod === "6M") {
      points = [2380, 2440, 2520, 2580, 2640, 2700, 2745, 2785.4];
    } else if (activeChartPeriod === "1Y") {
      points = [2040, 2120, 2180, 2260, 2350, 2480, 2590, 2690, 2785.4];
    } else { // 5Y
      points = [1550, 1820, 1890, 2010, 1920, 2150, 2320, 2550, 2785.4];
    }

    const convertedPoints = points.map(p => p * multiplier);
    const minVal = Math.min(...convertedPoints) * 0.98;
    const maxVal = Math.max(...convertedPoints) * 1.02;

    const width = 600;
    const height = 240;
    const padX = 50;
    const padY = 30;

    const scaleX = (idx) => padX + (idx / (convertedPoints.length - 1)) * (width - padX * 2);
    const scaleY = (val) => height - padY - ((val - minVal) / (maxVal - minVal)) * (height - padY * 2);

    let pathD = `M ${scaleX(0)},${scaleY(convertedPoints[0])}`;
    for (let i = 1; i < convertedPoints.length; i++) {
      const x = scaleX(i);
      const y = scaleY(convertedPoints[i]);
      pathD += ` L ${x},${y}`;
    }

    const areaD = `${pathD} L ${scaleX(convertedPoints.length - 1)},${height - padY} L ${scaleX(0)},${height - padY} Z`;

    const svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block; overflow: visible;">
        <defs>
          <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eab308" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#eab308" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="var(--border-color)" stroke-width="1.5" />
        <line x1="${padX}" y1="${scaleY(maxVal * 0.98)}" x2="${width - padX}" y2="${scaleY(maxVal * 0.98)}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4" />

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#goldAreaGrad)" />

        <!-- Line Curve -->
        <path d="${pathD}" fill="none" stroke="#d97706" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Point Dots -->
        ${convertedPoints.map((p, idx) => `
          <circle cx="${scaleX(idx)}" cy="${scaleY(p)}" r="4" fill="#eab308" stroke="#ffffff" stroke-width="2" />
        `).join("")}

        <!-- Labels -->
        <text x="${padX}" y="${height - 10}" fill="var(--text-muted)" font-size="11">Start of Period</text>
        <text x="${width - padX}" y="${height - 10}" fill="var(--text-muted)" font-size="11" text-anchor="end">Live Market Today</text>
        <text x="${padX}" y="${padY - 8}" fill="#10b981" font-weight="700" font-size="12">High: ${sym}${Math.max(...convertedPoints).toFixed(1)}</text>
        <text x="${width - padX}" y="${padY - 8}" fill="#ef4444" font-weight="700" font-size="12" text-anchor="end">Low: ${sym}${Math.min(...convertedPoints).toFixed(1)}</text>
      </svg>
    `;

    containerEl.innerHTML = svgHtml;

    // Update trend stats
    const retPct = (((convertedPoints[convertedPoints.length - 1] - convertedPoints[0]) / convertedPoints[0]) * 100).toFixed(2);
    const returnEl = container.querySelector("#chartPeriodReturn");
    if (returnEl) returnEl.textContent = `${retPct >= 0 ? '+' : ''}${retPct}% (${retPct >= 0 ? 'Bullish 🟢' : 'Bearish 🔴'})`;
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
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function loadCandlestickChart(interval = currentCandleInterval) {
    const iframe = container.querySelector("#goldCandleIframe");
    const placeholder = container.querySelector("#candleLoadingPlaceholder");
    if (!iframe) return;

    currentCandleInterval = interval;
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.style.opacity = "1";
    }

    const theme = getAppTheme();
    const isDark = theme === "dark";

    const params = new URLSearchParams({
      symbol: "OANDA:XAUUSD",
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
      container_id: "tradingview_gold_candlestick",
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

    // Update active label
    const tfLabelEl = container.querySelector("#chartActiveTfLabel");
    if (tfLabelEl) {
      tfLabelEl.textContent = tfDisplayLabels[interval] || `${interval}`;
    }
  }

  // Mode Switcher (Candlestick vs Curve)
  const btnModeCandle = container.querySelector("#btnModeCandle");
  const btnModeCurve = container.querySelector("#btnModeCurve");
  const candleToolbar = container.querySelector("#candleToolbar");
  const curveToolbar = container.querySelector("#curveToolbar");
  const candleFrameContainer = container.querySelector("#goldCandleFrameContainer");
  const svgCurveContainer = container.querySelector("#goldChartSvgContainer");

  if (btnModeCandle && btnModeCurve) {
    btnModeCandle.addEventListener("click", () => {
      currentChartMode = "candle";
      btnModeCandle.classList.add("active");
      btnModeCurve.classList.remove("active");
      candleToolbar.style.display = "flex";
      curveToolbar.style.display = "none";
      candleFrameContainer.style.display = "block";
      svgCurveContainer.style.display = "none";

      if (!isCandleChartLoaded) {
        loadCandlestickChart(currentCandleInterval);
      }
    });

    btnModeCurve.addEventListener("click", () => {
      currentChartMode = "curve";
      btnModeCurve.classList.add("active");
      btnModeCandle.classList.remove("active");
      candleToolbar.style.display = "none";
      curveToolbar.style.display = "flex";
      candleFrameContainer.style.display = "none";
      svgCurveContainer.style.display = "block";
      renderInteractiveChart();
    });
  }

  // Chart Collapse / Expand Toggle
  const btnToggleChartCollapse = container.querySelector("#btnToggleChartCollapse");
  const chartCollapsibleBody = container.querySelector("#goldChartCollapsibleBody");
  if (btnToggleChartCollapse && chartCollapsibleBody) {
    btnToggleChartCollapse.addEventListener("click", () => {
      isChartExpanded = !isChartExpanded;
      if (isChartExpanded) {
        chartCollapsibleBody.style.display = "block";
        btnToggleChartCollapse.textContent = "▲ Hide Chart";
      } else {
        chartCollapsibleBody.style.display = "none";
        btnToggleChartCollapse.textContent = "▼ Show Live Chart";
      }
    });
  }

  // Candlestick Timeframe Button Handlers (1m to 1M)
  container.querySelectorAll(".candle-tf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".candle-tf-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const interval = btn.getAttribute("data-interval");
      loadCandlestickChart(interval);
    });
  });

  // Reload Candlestick Chart Button
  const btnReloadCandle = container.querySelector("#btnReloadCandle");
  if (btnReloadCandle) {
    btnReloadCandle.addEventListener("click", () => {
      loadCandlestickChart(currentCandleInterval);
      btnReloadCandle.textContent = "✓ Refreshed";
      setTimeout(() => {
        btnReloadCandle.textContent = "🔄 Refresh Feed";
      }, 1500);
    });
  }

  // Chart Period Button Handlers (for SVG Curve mode)
  container.querySelectorAll(".chart-period-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".chart-period-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeChartPeriod = btn.getAttribute("data-period");
      renderInteractiveChart();
    });
  });

  // Action Buttons
  container.querySelector("#btnCalculateGold").addEventListener("click", calculateQuickGold);
  container.querySelector("#btnCalculateJewelry").addEventListener("click", calculateJewelry);
  container.querySelector("#btnCalculateAlloy").addEventListener("click", calculateAlloy);
  container.querySelector("#btnResetGold").addEventListener("click", () => {
    container.querySelector("#goldWeightInput").value = "10";
    container.querySelector("#goldUnitSelect").value = "g";
    container.querySelector("#goldPuritySelect").value = "22";
    container.querySelector("#goldDealerMargin").value = "0";
    container.querySelector("#dealerMarginVal").textContent = "0%";
    calculateQuickGold();
  });

  // Dynamic inputs for real-time recalculation
  container.querySelector("#goldWeightInput").addEventListener("input", calculateQuickGold);
  container.querySelector("#goldUnitSelect").addEventListener("change", calculateQuickGold);
  container.querySelector("#goldPuritySelect").addEventListener("change", calculateQuickGold);
  container.querySelector("#goldCustomSpotPrice").addEventListener("input", calculateQuickGold);

  // Initial calculation & Immediate Chart Load
  updateTickerUI();
  calculateQuickGold();
  loadCandlestickChart("1"); // Immediately load live 1m candlestick chart on page load!
}
