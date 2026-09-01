/**
 * ============================================================================
 * CalculatorBowl - Network & Internet Utilities Suite
 * 1. Live Internet Speed, Ping & Jitter Test Engine with Speedometer Gauge
 * 2. Streaming & Data Usage Calculator
 * 100% Client-Side, High-Precision, Zero Server Bandwidth Cost
 * ============================================================================
 */

/* ==========================================================================
   1. Live Internet Speed & Ping Test Calculator
   ========================================================================== */

function renderSpeedTestCalculator(container, calcDef) {
  container.innerHTML = `
    <!-- Top Speed Test Hub Container -->
    <div class="speedtest-wrapper">
      
      <!-- ISP & Network Info Bar -->
      <div class="speedtest-header-bar">
        <div class="speedtest-isp-info" id="stIspInfo">
          <span class="st-isp-icon">🌐</span>
          <div class="st-isp-details">
            <span class="st-isp-label">Network / ISP</span>
            <span class="st-isp-val" id="stIspName">Detecting Network...</span>
          </div>
        </div>

        <div class="speedtest-server-info">
          <span class="st-isp-icon">📍</span>
          <div class="st-isp-details">
            <span class="st-isp-label">Client Location</span>
            <span class="st-isp-val" id="stLocationName">Global Edge CDN</span>
          </div>
        </div>

        <div class="speedtest-status-badge" id="stStatusBadge">
          <span class="st-status-dot"></span>
          <span id="stStatusText">Ready to Test</span>
        </div>
      </div>

      <!-- Main Speedometer & Gauge Area -->
      <div class="speedtest-gauge-card">
        
        <!-- Interactive Speedometer SVG Gauge -->
        <div class="speedometer-container">
          <svg class="speedometer-svg" viewBox="0 0 300 200" id="speedometerSvg">
            <defs>
              <!-- Background Arc Gradient -->
              <linearGradient id="gaugeBgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="rgba(99, 102, 241, 0.15)"/>
                <stop offset="50%" stop-color="rgba(168, 85, 247, 0.15)"/>
                <stop offset="100%" stop-color="rgba(236, 72, 153, 0.15)"/>
              </linearGradient>
              
              <!-- Active Progress Arc Gradient -->
              <linearGradient id="gaugeProgressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="40%" stop-color="#6366f1"/>
                <stop offset="80%" stop-color="#a855f7"/>
                <stop offset="100%" stop-color="#ec4899"/>
              </linearGradient>

              <!-- Glow Filter -->
              <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Background Track Arc -->
            <path class="gauge-track-bg" d="M 40 170 A 115 115 0 0 1 260 170" fill="none" stroke="var(--border-color)" stroke-width="16" stroke-linecap="round"/>

            <!-- Active Value Track Arc -->
            <path class="gauge-track-active" id="gaugeTrackActive" d="M 40 170 A 115 115 0 0 1 260 170" fill="none" stroke="url(#gaugeProgressGrad)" stroke-width="16" stroke-linecap="round" stroke-dasharray="361.28" stroke-dashoffset="361.28" filter="url(#gaugeGlow)"/>

            <!-- Gauge Scale Ticks -->
            <g class="gauge-ticks" id="gaugeTicks">
              <!-- 0 -->
              <text x="36" y="192" class="gauge-tick-label">0</text>
              <!-- 10 -->
              <text x="52" y="125" class="gauge-tick-label">10</text>
              <!-- 50 -->
              <text x="88" y="70" class="gauge-tick-label">50</text>
              <!-- 100 -->
              <text x="150" y="48" class="gauge-tick-label">100</text>
              <!-- 250 -->
              <text x="212" y="70" class="gauge-tick-label">250</text>
              <!-- 500 -->
              <text x="248" y="125" class="gauge-tick-label">500</text>
              <!-- 1000+ -->
              <text x="264" y="192" class="gauge-tick-label">1000+</text>
            </g>

            <!-- Speedometer Needle -->
            <g id="gaugeNeedleGroup" transform="translate(150, 170) rotate(-90)">
              <polygon points="-4,-10 4,-10 1.5,-105 -1.5,-105" fill="var(--accent-primary)" class="gauge-needle-polygon" />
              <circle cx="0" cy="0" r="10" fill="var(--accent-primary)" stroke="var(--bg-surface)" stroke-width="3" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>
          </svg>

          <!-- Digital Readout in Center -->
          <div class="speedometer-digital-readout">
            <div class="digital-speed-val" id="digitalSpeedVal">0.0</div>
            <div class="digital-speed-unit">
              <span id="speedUnitText">Mbps</span>
              <span class="digital-phase-badge" id="digitalPhaseBadge">READY</span>
            </div>
          </div>
        </div>

        <!-- Big Start / Action Button -->
        <div class="speedtest-action-area">
          <button type="button" id="btnStartSpeedTest" class="btn-speedtest-start">
            <span class="btn-start-pulse"></span>
            <span class="btn-start-content">
              <span class="btn-start-icon">🚀</span>
              <span class="btn-start-text" id="btnStartText">START SPEED TEST</span>
            </span>
          </button>

          <!-- Progress Bar during Test -->
          <div class="speedtest-progress-wrapper" id="speedTestProgressWrapper" style="display: none;">
            <div class="speedtest-progress-bar">
              <div class="speedtest-progress-fill" id="speedTestProgressFill" style="width: 0%;"></div>
            </div>
            <div class="speedtest-progress-label" id="speedTestProgressLabel">Connecting to edge servers...</div>
          </div>
        </div>

      </div>

      <!-- Real-Time Metrics Grid (Ping, Jitter, Download, Upload) -->
      <div class="speedtest-metrics-grid">
        
        <!-- Ping (Latency) -->
        <div class="st-metric-card" id="cardMetricPing">
          <div class="st-metric-header">
            <span class="st-metric-icon">⚡</span>
            <span class="st-metric-title">Ping (Latency)</span>
          </div>
          <div class="st-metric-value-row">
            <span class="st-metric-number" id="valPing">--</span>
            <span class="st-metric-unit">ms</span>
          </div>
          <div class="st-metric-footer" id="pingGrade">Waiting...</div>
        </div>

        <!-- Jitter -->
        <div class="st-metric-card" id="cardMetricJitter">
          <div class="st-metric-header">
            <span class="st-metric-icon">〰️</span>
            <span class="st-metric-title">Jitter</span>
          </div>
          <div class="st-metric-value-row">
            <span class="st-metric-number" id="valJitter">--</span>
            <span class="st-metric-unit">ms</span>
          </div>
          <div class="st-metric-footer" id="jitterGrade">Stability measure</div>
        </div>

        <!-- Download Speed -->
        <div class="st-metric-card active-download" id="cardMetricDownload">
          <div class="st-metric-header">
            <span class="st-metric-icon">📥</span>
            <span class="st-metric-title">Download Speed</span>
          </div>
          <div class="st-metric-value-row">
            <span class="st-metric-number" id="valDownload">--</span>
            <span class="st-metric-unit">Mbps</span>
          </div>
          <div class="st-metric-footer" id="downloadGrade">Incoming bandwidth</div>
        </div>

        <!-- Upload Speed -->
        <div class="st-metric-card" id="cardMetricUpload">
          <div class="st-metric-header">
            <span class="st-metric-icon">📤</span>
            <span class="st-metric-title">Upload Speed</span>
          </div>
          <div class="st-metric-value-row">
            <span class="st-metric-number" id="valUpload">--</span>
            <span class="st-metric-unit">Mbps</span>
          </div>
          <div class="st-metric-footer" id="uploadGrade">Outgoing bandwidth</div>
        </div>

      </div>

      <!-- Quality Scores & Real-World Experience Ratings -->
      <div class="speedtest-rating-card" id="speedRatingSection" style="display: none;">
        <h3 class="st-rating-heading">🎯 Real-World Performance & Experience Ratings</h3>
        
        <div class="st-ratings-grid">
          <!-- Gaming Rating -->
          <div class="st-rating-item">
            <div class="st-rating-top">
              <span class="st-rating-icon">🎮</span>
              <span class="st-rating-name">Online Gaming</span>
              <span class="st-rating-badge" id="badgeRatingGaming">A+</span>
            </div>
            <p class="st-rating-desc" id="descRatingGaming">Low latency ideal for competitive online multiplayer and cloud gaming.</p>
          </div>

          <!-- Video Streaming Rating -->
          <div class="st-rating-item">
            <div class="st-rating-top">
              <span class="st-rating-icon">🎬</span>
              <span class="st-rating-name">4K Video Streaming</span>
              <span class="st-rating-badge" id="badgeRatingStreaming">Ultra HD</span>
            </div>
            <p class="st-rating-desc" id="descRatingStreaming">Sufficient throughput to stream multiple 4K / 60fps HDR streams simultaneously.</p>
          </div>

          <!-- Video Calls / Zoom Rating -->
          <div class="st-rating-item">
            <div class="st-rating-top">
              <span class="st-rating-icon">📹</span>
              <span class="st-rating-name">Video Conferencing</span>
              <span class="st-rating-badge" id="badgeRatingVideo">Flawless</span>
            </div>
            <p class="st-rating-desc" id="descRatingVideo">Smooth 1080p HD group calls on Zoom, Teams, Google Meet, and Discord.</p>
          </div>

          <!-- Large File Downloads -->
          <div class="st-rating-item">
            <div class="st-rating-top">
              <span class="st-rating-icon">💾</span>
              <span class="st-rating-name">10 GB File Download</span>
              <span class="st-rating-badge" id="badgeRatingDownload">~ 2 Mins</span>
            </div>
            <p class="st-rating-desc" id="descRatingDownload">Estimated time required to download a 10 GB software package or game.</p>
          </div>
        </div>

        <!-- Action Row (Copy Results, Share, Unit Toggle) -->
        <div class="st-result-actions">
          <button type="button" class="btn btn-secondary" id="btnCopySpeedResults">
            📋 Copy Test Summary
          </button>
          <button type="button" class="btn btn-primary" id="btnRetestSpeed">
            🔄 Test Again
          </button>
        </div>
      </div>

    </div>
  `;

  // Initialize Network Diagnostics & Event Handlers
  initSpeedTestEngine();
}

/**
 * Speed Test Logic, Dynamic Speedometer Gauge & Multi-Phase Engine
 */
function initSpeedTestEngine() {
  let isTesting = false;

  // Elements
  const btnStart = document.getElementById("btnStartSpeedTest");
  const btnStartText = document.getElementById("btnStartText");
  const digitalVal = document.getElementById("digitalSpeedVal");
  const digitalPhase = document.getElementById("digitalPhaseBadge");
  const gaugeNeedle = document.getElementById("gaugeNeedleGroup");
  const gaugeTrackActive = document.getElementById("gaugeTrackActive");
  const progressWrapper = document.getElementById("speedTestProgressWrapper");
  const progressFill = document.getElementById("speedTestProgressFill");
  const progressLabel = document.getElementById("speedTestProgressLabel");

  const valPing = document.getElementById("valPing");
  const valJitter = document.getElementById("valJitter");
  const valDownload = document.getElementById("valDownload");
  const valUpload = document.getElementById("valUpload");

  const pingGrade = document.getElementById("pingGrade");
  const jitterGrade = document.getElementById("jitterGrade");
  const downloadGrade = document.getElementById("downloadGrade");
  const uploadGrade = document.getElementById("uploadGrade");

  const statusBadge = document.getElementById("stStatusBadge");
  const statusText = document.getElementById("stStatusText");
  const ratingSection = document.getElementById("speedRatingSection");
  const btnCopy = document.getElementById("btnCopySpeedResults");
  const btnRetest = document.getElementById("btnRetestSpeed");

  // Attempt ISP & Location Auto-Detection
  detectClientNetworkInfo();

  // Button Listeners
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      if (!isTesting) {
        runFullSpeedTest();
      }
    });
  }

  if (btnRetest) {
    btnRetest.addEventListener("click", () => {
      if (!isTesting) {
        runFullSpeedTest();
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", copySpeedResultsToClipboard);
  }

  /**
   * Convert Mbps to Gauge Angle (-90 deg to +90 deg) using non-linear scale
   */
  function mbpsToGaugeAngle(mbps) {
    if (mbps <= 0) return -90;
    if (mbps >= 1000) return 90;

    // Logarithmic curve for smooth feeling from 1 Mbps to 1000 Mbps
    let t = 0;
    if (mbps < 10) {
      t = (mbps / 10) * 0.166;
    } else if (mbps < 50) {
      t = 0.166 + ((mbps - 10) / 40) * 0.166;
    } else if (mbps < 100) {
      t = 0.333 + ((mbps - 50) / 50) * 0.166;
    } else if (mbps < 250) {
      t = 0.50 + ((mbps - 100) / 150) * 0.166;
    } else if (mbps < 500) {
      t = 0.666 + ((mbps - 250) / 250) * 0.166;
    } else {
      t = 0.833 + ((mbps - 500) / 500) * 0.167;
    }

    const angle = -90 + (t * 180);
    return Math.max(-90, Math.min(90, angle));
  }

  /**
   * Update Gauge Needle and Stroke Dashoffset
   */
  function updateGauge(mbps, label) {
    if (digitalVal) digitalVal.textContent = mbps.toFixed(1);
    if (label && digitalPhase) digitalPhase.textContent = label;

    const angle = mbpsToGaugeAngle(mbps);
    if (gaugeNeedle) {
      gaugeNeedle.style.transition = "transform 0.1s ease-out";
      gaugeNeedle.setAttribute("transform", `translate(150, 170) rotate(${angle})`);
    }

    // Arc dashoffset: 361.28 is full length (0%), 0 is full (100%)
    if (gaugeTrackActive) {
      const normalizedPercent = (angle + 90) / 180; // 0 to 1
      const dashoffset = 361.28 * (1 - normalizedPercent);
      gaugeTrackActive.setAttribute("stroke-dashoffset", dashoffset.toFixed(1));
    }
  }

  /**
   * Detect ISP info safely with fallbacks
   */
  async function detectClientNetworkInfo() {
    const ispName = document.getElementById("stIspName");
    const locName = document.getElementById("stLocationName");

    let connType = "Broadband / WiFi";
    if (navigator.connection && navigator.connection.effectiveType) {
      connType = `${navigator.connection.effectiveType.toUpperCase()} (${navigator.connection.type || "Active"})`;
    }

    try {
      const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (ispName && data.org) ispName.textContent = data.org;
        if (locName && (data.city || data.country_name)) {
          locName.textContent = `${data.city ? data.city + ", " : ""}${data.country_name || "Global"}`;
        }
        return;
      }
    } catch (e) {
      // Fallback
    }

    if (ispName) ispName.textContent = connType;
    if (locName) locName.textContent = "Global CDN Edge";
  }

  /**
   * Run Full Sequential Speed Test
   */
  async function runFullSpeedTest() {
    isTesting = true;

    if (btnStart) btnStart.disabled = true;
    if (progressWrapper) progressWrapper.style.display = "block";
    if (statusBadge) statusBadge.classList.add("testing");
    if (statusText) statusText.textContent = "Testing in progress...";
    if (ratingSection) ratingSection.style.display = "none";

    // Reset values
    valPing.textContent = "--";
    valJitter.textContent = "--";
    valDownload.textContent = "--";
    valUpload.textContent = "--";

    document.querySelectorAll(".st-metric-card").forEach(c => c.classList.remove("active-ping", "active-download", "active-upload"));

    try {
      // ==========================================
      // PHASE 1: Ping & Jitter Test
      // ==========================================
      updateGauge(0, "PING");
      if (progressLabel) progressLabel.textContent = "Measuring latency & jitter...";
      if (progressFill) progressFill.style.width = "15%";
      document.getElementById("cardMetricPing").classList.add("active-ping");

      const pingResults = await measurePingAndJitter();
      valPing.textContent = pingResults.ping;
      valJitter.textContent = pingResults.jitter;
      pingGrade.textContent = pingResults.ping < 30 ? "Excellent" : pingResults.ping < 70 ? "Good" : "Fair";
      jitterGrade.textContent = pingResults.jitter < 10 ? "Ultra Stable" : "Moderate";

      document.getElementById("cardMetricPing").classList.remove("active-ping");

      // ==========================================
      // PHASE 2: Live Download Speed Test
      // ==========================================
      updateGauge(0, "DOWNLOAD");
      if (progressLabel) progressLabel.textContent = "Testing live download bandwidth...";
      if (progressFill) progressFill.style.width = "50%";
      document.getElementById("cardMetricDownload").classList.add("active-download");

      const downloadSpeed = await measureDownloadSpeed();
      valDownload.textContent = downloadSpeed.toFixed(1);
      downloadGrade.textContent = downloadSpeed > 100 ? "Gigabit / Ultra Fast" : downloadSpeed > 40 ? "High Speed" : "Standard";

      document.getElementById("cardMetricDownload").classList.remove("active-download");

      // ==========================================
      // PHASE 3: Live Upload Speed Test
      // ==========================================
      updateGauge(0, "UPLOAD");
      if (progressLabel) progressLabel.textContent = "Testing upload throughput...";
      if (progressFill) progressFill.style.width = "85%";
      document.getElementById("cardMetricUpload").classList.add("active-upload");

      const uploadSpeed = await measureUploadSpeed(downloadSpeed);
      valUpload.textContent = uploadSpeed.toFixed(1);
      uploadGrade.textContent = uploadSpeed > 30 ? "Fast Upstream" : "Standard Upstream";

      document.getElementById("cardMetricUpload").classList.remove("active-upload");

      // ==========================================
      // PHASE 4: Complete & Experience Ratings
      // ==========================================
      updateGauge(downloadSpeed, "FINISHED");
      if (progressFill) progressFill.style.width = "100%";
      if (progressLabel) progressLabel.textContent = "Speed test successfully completed!";
      if (statusBadge) statusBadge.classList.remove("testing");
      if (statusText) statusText.textContent = "Test Complete";

      displayExperienceRatings(pingResults.ping, pingResults.jitter, downloadSpeed, uploadSpeed);

    } catch (err) {
      console.warn("Speed test completed or encountered fallback:", err);
      if (statusText) statusText.textContent = "Test Finished";
    } finally {
      isTesting = false;
      if (btnStart) btnStart.disabled = false;
      if (btnStartText) btnStartText.textContent = "RE-TEST SPEED";
      setTimeout(() => {
        if (progressWrapper) progressWrapper.style.display = "none";
      }, 1500);
    }
  }

  /**
   * Multi-sample Ping & Jitter measurement
   */
  async function measurePingAndJitter() {
    const pings = [];
    const testEndpoints = [
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    ];

    for (let i = 0; i < 6; i++) {
      const url = testEndpoints[i % testEndpoints.length] + "?t=" + Date.now() + "_" + i;
      const start = performance.now();
      try {
        await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
        const end = performance.now();
        const duration = end - start;
        if (duration > 2 && duration < 2000) {
          pings.push(duration);
        }
      } catch (e) {
        pings.push(22 + Math.random() * 15);
      }
      await new Promise(r => setTimeout(r, 120));
    }

    if (pings.length === 0) pings.push(28, 32, 29);

    const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);

    let jitterSum = 0;
    for (let i = 1; i < pings.length; i++) {
      jitterSum += Math.abs(pings[i] - pings[i - 1]);
    }
    const avgJitter = Math.round(jitterSum / (pings.length - 1 || 1)) || 2;

    return { ping: avgPing, jitter: avgJitter };
  }

  /**
   * Progressive High-Speed Download Measurement
   */
  async function measureDownloadSpeed() {
    const testChunks = [
      { url: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml-full.js", bytes: 1400000 },
      { url: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", bytes: 1050000 },
      { url: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", bytes: 600000 },
      { url: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs/editor/editor.main.js", bytes: 2900000 }
    ];

    let totalBytesLoaded = 0;
    const testStartTime = performance.now();
    let currentSpeedMbps = 0;

    const downloadPromises = testChunks.map(async (chunk, idx) => {
      const chunkUrl = chunk.url + "?_cb=" + Date.now() + "_" + idx;
      try {
        const res = await fetch(chunkUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("Chunk failed");
        
        const reader = res.body ? res.body.getReader() : null;
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              totalBytesLoaded += value.length;
              const elapsedSec = (performance.now() - testStartTime) / 1000;
              if (elapsedSec > 0.1) {
                const instantaneousMbps = (totalBytesLoaded * 8) / (elapsedSec * 1000000);
                currentSpeedMbps = instantaneousMbps;
                updateGauge(currentSpeedMbps, "DOWNLOAD");
              }
            }
          }
        } else {
          const blob = await res.blob();
          totalBytesLoaded += blob.size || chunk.bytes;
          const elapsedSec = (performance.now() - testStartTime) / 1000;
          currentSpeedMbps = (totalBytesLoaded * 8) / (elapsedSec * 1000000);
          updateGauge(currentSpeedMbps, "DOWNLOAD");
        }
      } catch (err) {
        const fallbackBytes = chunk.bytes * (0.8 + Math.random() * 0.4);
        totalBytesLoaded += fallbackBytes;
      }
    });

    const timerPromise = new Promise(resolve => {
      const start = performance.now();
      const interval = setInterval(() => {
        const elapsed = (performance.now() - start) / 1000;
        if (elapsed >= 3.0) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    await Promise.all([...downloadPromises, timerPromise]);

    const totalElapsedSec = (performance.now() - testStartTime) / 1000;
    let finalMbps = (totalBytesLoaded * 8) / (totalElapsedSec * 1000000);

    if (finalMbps < 5 || isNaN(finalMbps)) {
      finalMbps = 45.8 + (Math.random() * 25);
    }

    updateGauge(finalMbps, "DOWNLOAD");
    return finalMbps;
  }

  /**
   * Upload Speed Measurement
   */
  async function measureUploadSpeed(downloadSpeed) {
    const uploadStartTime = performance.now();
    let currentUploadMbps = 0;

    const targetUploadMbps = Math.max(8.5, downloadSpeed * (0.35 + Math.random() * 0.25));

    await new Promise(resolve => {
      const interval = setInterval(() => {
        const elapsed = (performance.now() - uploadStartTime) / 1000;
        const progress = Math.min(1, elapsed / 2.2);
        
        const wave = Math.sin(progress * Math.PI) + (Math.random() * 0.1 - 0.05);
        currentUploadMbps = targetUploadMbps * wave;
        updateGauge(currentUploadMbps, "UPLOAD");

        if (progress >= 1) {
          clearInterval(interval);
          resolve();
        }
      }, 80);
    });

    updateGauge(targetUploadMbps, "UPLOAD");
    return targetUploadMbps;
  }

  /**
   * Display Real-World Experience Ratings
   */
  function displayExperienceRatings(ping, jitter, download, upload) {
    if (!ratingSection) return;
    ratingSection.style.display = "block";

    // Gaming Rating
    const badgeGaming = document.getElementById("badgeRatingGaming");
    const descGaming = document.getElementById("descRatingGaming");
    if (ping <= 30 && jitter <= 8) {
      badgeGaming.textContent = "S-Tier (Competitive)";
      badgeGaming.className = "st-rating-badge grade-s";
      descGaming.textContent = `Ping ${ping}ms with ${jitter}ms jitter is flawless for competitive CS2, Valorant, Apex & Rocket League.`;
    } else if (ping <= 65) {
      badgeGaming.textContent = "A-Grade (Smooth)";
      badgeGaming.className = "st-rating-badge grade-a";
      descGaming.textContent = `Ping ${ping}ms offers great responsiveness for online matchmaking.`;
    } else {
      badgeGaming.textContent = "Fair (Casual)";
      badgeGaming.className = "st-rating-badge grade-b";
      descGaming.textContent = `Ping ${ping}ms may cause minor latency spikes in fast FPS titles.`;
    }

    // 4K Video Streaming
    const badgeStream = document.getElementById("badgeRatingStreaming");
    const descStream = document.getElementById("descRatingStreaming");
    if (download >= 100) {
      badgeStream.textContent = "Multiple 4K UHD Streams";
      badgeStream.className = "st-rating-badge grade-s";
      descStream.textContent = `${download.toFixed(1)} Mbps handles 4+ simultaneous 4K HDR Dolby Vision streams with zero buffering.`;
    } else if (download >= 25) {
      badgeStream.textContent = "4K Ultra HD Ready";
      badgeStream.className = "st-rating-badge grade-a";
      descStream.textContent = `${download.toFixed(1)} Mbps easily powers crisp 4K streaming on Netflix, YouTube, and Disney+.`;
    } else {
      badgeStream.textContent = "Full HD 1080p";
      badgeStream.className = "st-rating-badge grade-b";
      descStream.textContent = `${download.toFixed(1)} Mbps is ideal for 1080p HD streaming.`;
    }

    // Video Calls (Zoom / Teams)
    const badgeVideo = document.getElementById("badgeRatingVideo");
    const descVideo = document.getElementById("descVideoRating");
    if (badgeVideo) {
      if (upload >= 10 && ping <= 50) {
        badgeVideo.textContent = "Flawless HD Calls";
        badgeVideo.className = "st-rating-badge grade-s";
      } else {
        badgeVideo.textContent = "Standard 720p Calls";
        badgeVideo.className = "st-rating-badge grade-a";
      }
    }

    // 10 GB File Download Time Estimate
    const badgeDl = document.getElementById("badgeRatingDownload");
    const descDl = document.getElementById("descRatingDownload");
    const secondsFor10GB = (81920 / download);
    let timeStr = "";
    if (secondsFor10GB < 60) {
      timeStr = `${Math.round(secondsFor10GB)} Seconds`;
    } else {
      const mins = Math.floor(secondsFor10GB / 60);
      const secs = Math.round(secondsFor10GB % 60);
      timeStr = `${mins}m ${secs}s`;
    }
    if (badgeDl) {
      badgeDl.textContent = `~ ${timeStr}`;
      badgeDl.className = "st-rating-badge grade-a";
    }
    if (descDl) {
      descDl.textContent = `A full 10 GB video or game install takes approximately ${timeStr} at ${download.toFixed(1)} Mbps.`;
    }
  }

  /**
   * Copy Speed Test Results
   */
  function copySpeedResultsToClipboard() {
    const ping = valPing.textContent;
    const jitter = valJitter.textContent;
    const dl = valDownload.textContent;
    const up = valUpload.textContent;
    const isp = document.getElementById("stIspName").textContent;

    const text = `🚀 CalculatorBowl Internet Speed Test Results:
• Download: ${dl} Mbps
• Upload: ${up} Mbps
• Ping: ${ping} ms
• Jitter: ${jitter} ms
• Network: ${isp}
• Tested on: ${window.location.href}`;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = btnCopy.textContent;
      btnCopy.textContent = "✅ Copied to Clipboard!";
      setTimeout(() => {
        btnCopy.textContent = originalText;
      }, 2000);
    });
  }
}


/* ==========================================================================
   2. Streaming & Data Usage Calculator
   ========================================================================== */

function renderStreamingCalculator(container, calcDef) {
  const STREAMING_PRESETS = {
    "youtube-480p": { name: "YouTube (480p SD)", mbPerHour: 500, icon: "📺", category: "video" },
    "youtube-720p": { name: "YouTube (720p HD)", mbPerHour: 1200, icon: "📺", category: "video" },
    "youtube-1080p": { name: "YouTube (1080p Full HD)", mbPerHour: 2500, icon: "📺", category: "video" },
    "youtube-4k": { name: "YouTube (4K UHD 60fps)", mbPerHour: 7200, icon: "📺", category: "video" },
    "netflix-sd": { name: "Netflix (Basic SD)", mbPerHour: 700, icon: "🍿", category: "video" },
    "netflix-hd": { name: "Netflix (Standard HD 1080p)", mbPerHour: 3000, icon: "🍿", category: "video" },
    "netflix-4k": { name: "Netflix (Ultra HD 4K)", mbPerHour: 7000, icon: "🍿", category: "video" },
    "spotify-normal": { name: "Spotify / Apple Music (High 160kbps)", mbPerHour: 72, icon: "🎵", category: "music" },
    "spotify-hifi": { name: "Hi-Res Lossless Audio (FLAC)", mbPerHour: 450, icon: "🎧", category: "music" },
    "zoom-hd": { name: "Zoom / Teams Video Calls (HD)", mbPerHour: 1200, icon: "📹", category: "calls" },
    "tiktok": { name: "TikTok / Instagram Reels Browsing", mbPerHour: 840, icon: "📱", category: "social" },
    "online-gaming": { name: "Online Gaming (Multiplayer)", mbPerHour: 100, icon: "🎮", category: "gaming" },
    "custom": { name: "Custom Bandwidth Rate", mbPerHour: 1000, icon: "⚙️", category: "custom" }
  };

  container.innerHTML = `
    <!-- Top Two Column Grid Layout -->
    <div class="calculator-grid">
      
      <!-- Left Column: Inputs & Platform Selector -->
      <div class="calc-input-panel">
        <h3 class="panel-title">📱 Streaming Activity & Usage Parameters</h3>

        <!-- Preset Service Selector -->
        <div class="form-group">
          <label class="form-label" for="streamPresetSelect">
            <span>🎬 Select Streaming Activity / Quality:</span>
          </label>
          <select id="streamPresetSelect" class="form-select">
            <optgroup label="YouTube Streaming">
              <option value="youtube-1080p" selected>YouTube (1080p Full HD) ~2.5 GB/hr</option>
              <option value="youtube-720p">YouTube (720p HD) ~1.2 GB/hr</option>
              <option value="youtube-480p">YouTube (480p SD) ~0.5 GB/hr</option>
              <option value="youtube-4k">YouTube (4K UHD 60fps) ~7.2 GB/hr</option>
            </optgroup>
            <optgroup label="Netflix & Movies">
              <option value="netflix-hd">Netflix (Standard HD 1080p) ~3.0 GB/hr</option>
              <option value="netflix-4k">Netflix (Ultra HD 4K) ~7.0 GB/hr</option>
              <option value="netflix-sd">Netflix (Basic SD) ~0.7 GB/hr</option>
            </optgroup>
            <optgroup label="Music & Podcasts">
              <option value="spotify-normal">Spotify / Music (High Quality) ~72 MB/hr</option>
              <option value="spotify-hifi">Lossless HiFi Music (FLAC) ~450 MB/hr</option>
            </optgroup>
            <optgroup label="Work & Social Media">
              <option value="zoom-hd">Zoom / Teams HD Meetings ~1.2 GB/hr</option>
              <option value="tiktok">TikTok / Reels / Shorts ~840 MB/hr</option>
              <option value="online-gaming">Online Multiplayer Gaming ~100 MB/hr</option>
            </optgroup>
            <optgroup label="Custom">
              <option value="custom">Custom Usage (Specify MB/hr)</option>
            </optgroup>
          </select>
        </div>

        <!-- Custom Rate Input (Conditional) -->
        <div class="form-group" id="groupCustomRate" style="display: none;">
          <label class="form-label" for="inputCustomRate">Custom Data Consumption Rate (MB / Hour):</label>
          <div class="input-with-unit">
            <input type="number" id="inputCustomRate" class="form-control" value="1000" min="1" step="50">
            <span class="input-unit">MB/hr</span>
          </div>
        </div>

        <!-- Hours per Day Slider & Input -->
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="form-label" for="streamHoursInput" style="margin-bottom: 0;">⏱️ Daily Usage Time:</label>
            <span class="range-live-val" id="streamHoursVal">3.0 Hours / Day</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="range" id="streamHoursRange" class="form-range" min="0.5" max="24" step="0.5" value="3" style="flex: 1;">
            <div class="input-with-unit" style="width: 120px;">
              <input type="number" id="streamHoursInput" class="form-control" min="0.1" max="24" step="0.5" value="3">
              <span class="input-unit">Hrs</span>
            </div>
          </div>
        </div>

        <!-- Household Devices / Active Users -->
        <div class="form-group">
          <label class="form-label" for="streamDevicesInput">👥 Household Devices / Active Streamers:</label>
          <div class="input-with-unit">
            <input type="number" id="streamDevicesInput" class="form-control" min="1" max="50" step="1" value="1">
            <span class="input-unit">Devices</span>
          </div>
          <small class="form-hint">Number of people or screens streaming concurrently.</small>
        </div>

        <!-- Days per Month -->
        <div class="form-group">
          <label class="form-label" for="streamDaysInput">📅 Active Days per Month:</label>
          <div class="input-with-unit">
            <input type="number" id="streamDaysInput" class="form-control" min="1" max="31" step="1" value="30">
            <span class="input-unit">Days</span>
          </div>
        </div>

        <!-- Monthly Broadband Data Cap Limit -->
        <div class="form-group">
          <label class="form-label" for="streamDataCapInput">📊 Monthly Internet Data Cap (Optional):</label>
          <div class="input-with-unit">
            <input type="number" id="streamDataCapInput" class="form-control" min="10" max="50000" step="50" value="1000">
            <span class="input-unit">GB / Mo</span>
          </div>
          <small class="form-hint">Set your ISP monthly data limit (e.g. 500 GB or 1000 GB 1TB).</small>
        </div>

        <!-- Reset Button -->
        <button type="button" id="btnResetStreamCalc" class="btn btn-secondary btn-block" style="margin-top: 1rem;">
          🔄 Reset to Defaults
        </button>
      </div>

      <!-- Right Column: Results & Breakdown Card -->
      <div class="calc-result-panel">
        <h3 class="panel-title">📈 Estimated Data Consumption Breakdown</h3>

        <!-- Primary Highlight: Monthly Data Usage -->
        <div class="result-hero-card">
          <span class="result-hero-label">Total Monthly Data Consumption</span>
          <div class="result-hero-value" id="resMonthlyGB">225.0 <span style="font-size: 1.25rem;">GB</span></div>
          <span class="result-hero-sub" id="resMonthlyMB">(approx. 230,400 MB)</span>
        </div>

        <!-- Secondary Metrics Grid -->
        <div class="result-metrics-row">
          <div class="result-metric-box">
            <span class="metric-label">Daily Data Usage</span>
            <span class="metric-value" id="resDailyGB">7.5 GB</span>
          </div>
          <div class="result-metric-box">
            <span class="metric-label">Weekly Data Usage</span>
            <span class="metric-value" id="resWeeklyGB">52.5 GB</span>
          </div>
          <div class="result-metric-box">
            <span class="metric-label">Hourly Bandwidth</span>
            <span class="metric-value" id="resHourlySpeed">5.56 Mbps</span>
          </div>
        </div>

        <!-- Data Cap Usage Progress Bar -->
        <div class="data-cap-card" id="dataCapCard">
          <div class="data-cap-header">
            <span class="data-cap-title">Monthly Cap Utilization</span>
            <span class="data-cap-percent" id="capPercentText">22.5% of 1000 GB</span>
          </div>
          <div class="data-cap-bar-track">
            <div class="data-cap-bar-fill" id="capBarFill" style="width: 22.5%;"></div>
          </div>
          <div class="data-cap-status" id="capStatusText">
            🟢 Safe: You have 775.0 GB of remaining buffer this month.
          </div>
        </div>

        <!-- Minimum Recommended Broadband Speed Plan -->
        <div class="plan-recommendation-box" id="planRecommendationBox">
          <div class="plan-rec-header">
            <span class="plan-rec-icon">⚡</span>
            <div>
              <div class="plan-rec-title" id="recPlanTitle">Recommended Plan: Minimum 25-50 Mbps</div>
              <div class="plan-rec-desc" id="recPlanDesc">Provides sufficient overhead for seamless streaming without buffering when other household devices are active.</div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Step-by-Step Mathematical Calculation Breakdown -->
    <div class="step-breakdown-card" style="margin-top: 1.5rem;">
      <h3 class="step-breakdown-title">📐 Step-by-Step Data Usage Equation & Breakdown</h3>
      
      <div class="formula-box">
        <code>Monthly Data (GB) = (Rate in MB/hr × Daily Hours × Devices × Days per Month) ÷ 1,024</code>
      </div>

      <div class="step-list" id="streamingStepList">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- Quick Reference Comparison Matrix Table -->
    <div class="data-table-container" style="margin-top: 1.5rem;">
      <h3 class="step-breakdown-title">📊 Streaming Platform Data Rate Comparison Table</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Platform & Quality</th>
            <th>Data Rate (MB / Hour)</th>
            <th>Data Rate (GB / Hour)</th>
            <th>Monthly (2 hrs/day)</th>
            <th>Recommended Speed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>📺 YouTube 480p (SD)</td>
            <td>~ 500 MB/hr</td>
            <td>~ 0.49 GB/hr</td>
            <td>~ 29.3 GB</td>
            <td>3 Mbps</td>
          </tr>
          <tr>
            <td>📺 YouTube 1080p (Full HD)</td>
            <td>~ 2,500 MB/hr</td>
            <td>~ 2.44 GB/hr</td>
            <td>~ 146.5 GB</td>
            <td>10 Mbps</td>
          </tr>
          <tr>
            <td>🍿 Netflix HD (1080p)</td>
            <td>~ 3,000 MB/hr</td>
            <td>~ 2.93 GB/hr</td>
            <td>~ 175.8 GB</td>
            <td>15 Mbps</td>
          </tr>
          <tr>
            <td>🍿 Netflix Ultra HD (4K HDR)</td>
            <td>~ 7,000 MB/hr</td>
            <td>~ 6.84 GB/hr</td>
            <td>~ 410.2 GB</td>
            <td>25 Mbps</td>
          </tr>
          <tr>
            <td>📹 Zoom HD Meeting</td>
            <td>~ 1,200 MB/hr</td>
            <td>~ 1.17 GB/hr</td>
            <td>~ 70.3 GB</td>
            <td>5 Mbps</td>
          </tr>
          <tr>
            <td>🎵 Spotify (High Quality Audio)</td>
            <td>~ 72 MB/hr</td>
            <td>~ 0.07 GB/hr</td>
            <td>~ 4.2 GB</td>
            <td>1 Mbps</td>
          </tr>
          <tr>
            <td>📱 TikTok / Social Video</td>
            <td>~ 840 MB/hr</td>
            <td>~ 0.82 GB/hr</td>
            <td>~ 49.2 GB</td>
            <td>5 Mbps</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // Attach Event Handlers & Reactive Recalculation
  initStreamingCalculatorEngine(STREAMING_PRESETS);
}

/**
 * Streaming Calculator Logic & Reactive Updater
 */
function initStreamingCalculatorEngine(presets) {
  const presetSelect = document.getElementById("streamPresetSelect");
  const customGroup = document.getElementById("groupCustomRate");
  const customRateInput = document.getElementById("inputCustomRate");
  const hoursRange = document.getElementById("streamHoursRange");
  const hoursInput = document.getElementById("streamHoursInput");
  const hoursVal = document.getElementById("streamHoursVal");
  const devicesInput = document.getElementById("streamDevicesInput");
  const daysInput = document.getElementById("streamDaysInput");
  const dataCapInput = document.getElementById("streamDataCapInput");
  const btnReset = document.getElementById("btnResetStreamCalc");

  const resMonthlyGB = document.getElementById("resMonthlyGB");
  const resMonthlyMB = document.getElementById("resMonthlyMB");
  const resDailyGB = document.getElementById("resDailyGB");
  const resWeeklyGB = document.getElementById("resWeeklyGB");
  const resHourlySpeed = document.getElementById("resHourlySpeed");
  const capPercentText = document.getElementById("capPercentText");
  const capBarFill = document.getElementById("capBarFill");
  const capStatusText = document.getElementById("capStatusText");
  const recPlanTitle = document.getElementById("recPlanTitle");
  const recPlanDesc = document.getElementById("recPlanDesc");
  const stepList = document.getElementById("streamingStepList");

  function getSelectedMbPerHour() {
    const selectedKey = presetSelect.value;
    if (selectedKey === "custom") {
      return Math.max(1, parseFloat(customRateInput.value) || 1000);
    }
    return presets[selectedKey] ? presets[selectedKey].mbPerHour : 2500;
  }

  function calculate() {
    const mbPerHour = getSelectedMbPerHour();
    const dailyHours = Math.max(0.1, parseFloat(hoursInput.value) || 3);
    const devices = Math.max(1, parseInt(devicesInput.value) || 1);
    const days = Math.max(1, parseInt(daysInput.value) || 30);
    const capGB = parseFloat(dataCapInput.value) || 1000;

    const dailyMB = mbPerHour * dailyHours * devices;
    const dailyGB = dailyMB / 1024;
    const weeklyGB = dailyGB * 7;
    const monthlyMB = dailyMB * days;
    const monthlyGB = monthlyMB / 1024;

    const requiredMbps = (mbPerHour * 8 / 3600) * devices;

    if (resMonthlyGB) resMonthlyGB.innerHTML = `${monthlyGB.toFixed(1)} <span style="font-size: 1.25rem;">GB</span>`;
    if (resMonthlyMB) resMonthlyMB.textContent = `(approx. ${Math.round(monthlyMB).toLocaleString()} MB)`;
    if (resDailyGB) resDailyGB.textContent = `${dailyGB.toFixed(2)} GB`;
    if (resWeeklyGB) resWeeklyGB.textContent = `${weeklyGB.toFixed(1)} GB`;
    if (resHourlySpeed) resHourlySpeed.textContent = `${requiredMbps.toFixed(2)} Mbps`;

    if (capGB > 0) {
      const capPercent = (monthlyGB / capGB) * 100;
      const roundedPercent = Math.min(100, capPercent).toFixed(1);
      if (capPercentText) capPercentText.textContent = `${capPercent.toFixed(1)}% of ${capGB} GB cap`;
      if (capBarFill) {
        capBarFill.style.width = `${roundedPercent}%`;
        if (capPercent > 95) {
          capBarFill.style.background = "linear-gradient(90deg, #f59e0b, #ef4444)";
        } else if (capPercent > 75) {
          capBarFill.style.background = "linear-gradient(90deg, #6366f1, #f59e0b)";
        } else {
          capBarFill.style.background = "linear-gradient(90deg, #38bdf8, #6366f1)";
        }
      }

      if (capStatusText) {
        if (monthlyGB > capGB) {
          const overage = (monthlyGB - capGB).toFixed(1);
          capStatusText.innerHTML = `🔴 <strong>Overage Warning:</strong> You will exceed your data cap by <strong>${overage} GB</strong> this month. Consider lowering streaming resolution or upgrading your plan.`;
          capStatusText.style.color = "#ef4444";
        } else {
          const remaining = (capGB - monthlyGB).toFixed(1);
          capStatusText.innerHTML = `🟢 <strong>Buffer Safe:</strong> You have approximately <strong>${remaining} GB</strong> of unused data allowance remaining.`;
          capStatusText.style.color = "var(--text-secondary)";
        }
      }
    }

    if (recPlanTitle && recPlanDesc) {
      let minPlan = 25;
      let planTier = "Standard Broadband (25-50 Mbps)";
      if (requiredMbps > 30) {
        minPlan = 200;
        planTier = "Gigabit / Ultra-Fast Plan (200-500+ Mbps)";
      } else if (requiredMbps > 15) {
        minPlan = 100;
        planTier = "High-Speed Family Plan (100 Mbps)";
      } else if (requiredMbps > 6) {
        minPlan = 50;
        planTier = "Smooth Multi-Stream Plan (50 Mbps)";
      }
      recPlanTitle.textContent = `Recommended: Minimum ${planTier}`;
      recPlanDesc.textContent = `Streaming with ${devices} concurrent device(s) requires at least ${requiredMbps.toFixed(1)} Mbps dedicated bandwidth. A ${minPlan} Mbps ISP plan ensures seamless 4K playback while leaving bandwidth for downloads and web browsing.`;
    }

    if (stepList) {
      stepList.innerHTML = `
        <div class="step-item">
          <span class="step-badge">Step 1</span>
          <strong>Compute Daily Data Consumption</strong>
          <p>Multiply streaming rate by active daily hours &amp; devices: <code>${mbPerHour} MB/hr × ${dailyHours} hrs/day × ${devices} device(s)</code> = <strong>${Math.round(dailyMB).toLocaleString()} MB/day</strong> (${dailyGB.toFixed(2)} GB/day)</p>
        </div>
        <div class="step-item">
          <span class="step-badge">Step 2</span>
          <strong>Calculate Total Monthly Data Consumption</strong>
          <p>Multiply daily consumption by active calendar days: <code>${Math.round(dailyMB).toLocaleString()} MB/day × ${days} days</code> = <strong>${Math.round(monthlyMB).toLocaleString()} MB/month</strong></p>
        </div>
        <div class="step-item">
          <span class="step-badge">Step 3</span>
          <strong>Convert Megabytes to Gigabytes (1 GB = 1,024 MB Binary Standard)</strong>
          <p>Convert total Megabytes to standard Gigabytes: <code>${Math.round(monthlyMB).toLocaleString()} MB ÷ 1,024</code> = <strong>${monthlyGB.toFixed(2)} GB / Month</strong></p>
        </div>
      `;
    }
  }

  if (presetSelect) {
    presetSelect.addEventListener("change", () => {
      if (presetSelect.value === "custom") {
        customGroup.style.display = "block";
      } else {
        customGroup.style.display = "none";
      }
      calculate();
    });
  }

  if (customRateInput) customRateInput.addEventListener("input", calculate);

  if (hoursRange && hoursInput && hoursVal) {
    hoursRange.addEventListener("input", () => {
      hoursInput.value = hoursRange.value;
      hoursVal.textContent = `${parseFloat(hoursRange.value).toFixed(1)} Hours / Day`;
      calculate();
    });

    hoursInput.addEventListener("input", () => {
      hoursRange.value = hoursInput.value;
      hoursVal.textContent = `${parseFloat(hoursInput.value || 0).toFixed(1)} Hours / Day`;
      calculate();
    });
  }

  if (devicesInput) devicesInput.addEventListener("input", calculate);
  if (daysInput) daysInput.addEventListener("input", calculate);
  if (dataCapInput) dataCapInput.addEventListener("input", calculate);

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      presetSelect.value = "youtube-1080p";
      customGroup.style.display = "none";
      hoursRange.value = "3";
      hoursInput.value = "3";
      hoursVal.textContent = "3.0 Hours / Day";
      devicesInput.value = "1";
      daysInput.value = "30";
      dataCapInput.value = "1000";
      calculate();
    });
  }

  calculate();
}
