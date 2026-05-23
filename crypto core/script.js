        // --- CONFIGURATION (UPDATED FOR V29 CRYPTO FOCUS) ---
        let currentSymbol = "BTCUSDT";
        let assetType = "crypto"; 
        let tvWidget = null;
        let scanResultsData = {}; 
        let strategicLevels = []; 
        let globalTrend = "NEUTRAL";         let bestSetupId = null;
        let priceInterval = null; 
        let currentLivePrice = 0;         
        let activeSessions = [];
        
        const TIMEFRAMES = [
            { label: 'M1', interval: '1m' },
            { label: 'M5', interval: '5m' },
            { label: 'M15', interval: '15m' },
            { label: 'M30', interval: '30m' },
            { label: 'H1', interval: '1h' },
            { label: 'H4', interval: '4h' }
        ];

        // SYMBOL MAP (UPDATED FOR BINANCE CRYPTO & PAXG)
        const SYMBOL_MAP = {
            // Gold / Commodities on Binance
            "XAUUSD": { tv: "BINANCE:PAXGUSDT", api: "PAXGUSDT", type: "commodity", decimals: 2 }, 
            "PAXGUSDT": { tv: "BINANCE:PAXGUSDT", api: "PAXGUSDT", type: "commodity", decimals: 2 },
            "PAXG": { tv: "BINANCE:PAXGUSDT", api: "PAXGUSDT", type: "commodity", decimals: 2 },
            
            // Major Crypto
            "BTCUSDT": { tv: "BINANCE:BTCUSDT", api: "BTCUSDT", type: "crypto", decimals: 2 },
            "BTC": { tv: "BINANCE:BTCUSDT", api: "BTCUSDT", type: "crypto", decimals: 2 },
            "ETHUSDT": { tv: "BINANCE:ETHUSDT", api: "ETHUSDT", type: "crypto", decimals: 2 },
            "ETH": { tv: "BINANCE:ETHUSDT", api: "ETHUSDT", type: "crypto", decimals: 2 },
            "BNBUSDT": { tv: "BINANCE:BNBUSDT", api: "BNBUSDT", type: "crypto", decimals: 2 },
            "SOLUSDT": { tv: "BINANCE:SOLUSDT", api: "SOLUSDT", type: "crypto", decimals: 3 },
            "ETCUSDT": { tv: "BINANCE:ETCUSDT", api: "ETCUSDT", type: "crypto", decimals: 3 },
            "XRPUSDT": { tv: "BINANCE:XRPUSDT", api: "XRPUSDT", type: "crypto", decimals: 4 },
            "ADAUSDT": { tv: "BINANCE:ADAUSDT", api: "ADAUSDT", type: "crypto", decimals: 4 },
            "DOGEUSDT": { tv: "BINANCE:DOGEUSDT", api: "DOGEUSDT", type: "crypto", decimals: 5 },
            "TRXUSDT": { tv: "BINANCE:TRXUSDT", api: "TRXUSDT", type: "crypto", decimals: 5 },
            
            // Altcoins
            "DOTUSDT": { tv: "BINANCE:DOTUSDT", api: "DOTUSDT", type: "crypto", decimals: 3 },
            "MATICUSDT": { tv: "BINANCE:MATICUSDT", api: "MATICUSDT", type: "crypto", decimals: 4 },
            "LTCUSDT": { tv: "BINANCE:LTCUSDT", api: "LTCUSDT", type: "crypto", decimals: 2 },
            "AVAXUSDT": { tv: "BINANCE:AVAXUSDT", api: "AVAXUSDT", type: "crypto", decimals: 3 },            "LINKUSDT": { tv: "BINANCE:LINKUSDT", api: "LINKUSDT", type: "crypto", decimals: 3 },
            "UNIUSDT": { tv: "BINANCE:UNIUSDT", api: "UNIUSDT", type: "crypto", decimals: 3 },
            "ATOMUSDT": { tv: "BINANCE:ATOMUSDT", api: "ATOMUSDT", type: "crypto", decimals: 3 },
            "FILUSDT": { tv: "BINANCE:FILUSDT", api: "FILUSDT", type: "crypto", decimals: 3 },
            "NEARUSDT": { tv: "BINANCE:NEARUSDT", api: "NEARUSDT", type: "crypto", decimals: 3 },
            "APTUSDT": { tv: "BINANCE:APTUSDT", api: "APTUSDT", type: "crypto", decimals: 3 },
            "OPUSDT": { tv: "BINANCE:OPUSDT", api: "OPUSDT", type: "crypto", decimals: 4 },
            "ARBUSDT": { tv: "BINANCE:ARBUSDT", api: "ARBUSDT", type: "crypto", decimals: 4 },
            "SUIUSDT": { tv: "BINANCE:SUIUSDT", api: "SUIUSDT", type: "crypto", decimals: 4 },
            "PEPEUSDT": { tv: "BINANCE:PEPEUSDT", api: "PEPEUSDT", type: "crypto", decimals: 7 },
            "SHIBUSDT": { tv: "BINANCE:SHIBUSDT", api: "SHIBUSDT", type: "crypto", decimals: 7 },
            "FETUSDT": { tv: "BINANCE:FETUSDT", api: "FETUSDT", type: "crypto", decimals: 4 },            "RNDRUSDT": { tv: "BINANCE:RNDRUSDT", api: "RNDRUSDT", type: "crypto", decimals: 4 },
        };

        const SESSIONS = [
            { name: 'ASIA', start: 0, end: 9, color: '#ff4081' }, // Simplified for Crypto
            { name: 'EUROPE', start: 8, end: 17, color: '#3d5afe' },
            { name: 'USA', start: 13, end: 22, color: '#00e676' }
        ];

        // --- INIT TRADINGVIEW ---
        function initTV(symbol = "BTCUSDT", interval = "15") {
            if(tvWidget) document.getElementById('tradingview_chart').innerHTML = "";
            
            // Determine TV Symbol
            let tvSymbol = "BINANCE:BTCUSDT"; // Default
            
            if(SYMBOL_MAP[symbol]) {
                tvSymbol = SYMBOL_MAP[symbol].tv;
            } else {
                // Auto-detect logic for unknown inputs
                let cleanSym = symbol.toUpperCase().trim();
                if(!cleanSym.endsWith("USDT")) cleanSym += "USDT";
                tvSymbol = `BINANCE:${cleanSym}`;
            }

            tvWidget = new TradingView.widget({
                "autosize": true, "symbol": tvSymbol, "interval": interval, "timezone": "Etc/UTC",
                "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#000000",
                "enable_publishing": false, "hide_top_toolbar": false, "save_image": false,
                "container_id": "tradingview_chart", "studies": ["RSI@tv-basicstudies"],
                "backgroundColor": "#000000", "gridLineColor": "#1e1e1e"
            });
        }

        // --- CORE LOGIC: INDICATORS (UNCHANGED) ---
        function getSeries(candles) {
            return {
                open: candles.map(c => parseFloat(c[1])),                high: candles.map(c => parseFloat(c[2])),
                low: candles.map(c => parseFloat(c[3])),
                close: candles.map(c => parseFloat(c[4]))
            };
        }

        function findFractalPivots(series, range = 5) {
            let pivots = []; 
            for (let i = range; i < series.high.length - range; i++) {
                let isHigh = true;
                let isLow = true;
                for (let j = 1; j <= range; j++) {
                    if (series.high[i] <= series.high[i-j] || series.high[i] <= series.high[i+j]) isHigh = false;                    if (series.low[i] >= series.low[i-j] || series.low[i] >= series.low[i+j]) isLow = false;
                }
                if (isHigh) pivots.push({ index: i, price: series.high[i], type: 'high' });
                if (isLow) pivots.push({ index: i, price: series.low[i], type: 'low' });            }
            return pivots;
        }

        // --- V29 STRATEGY ENGINE (FIXED & OPTIMIZED) ---
        function detectPatterns(series, pivots, atr, tfLabel) {
            const currentPrice = series.close[series.close.length - 1];
            const lastCloseIdx = series.close.length - 1;
            let patterns = [];

            // V29 FIX: Added validation helper to prevent inverted TP/SL
            const addPattern = (type, name, baseScore, entry, sl, tp, desc, category, wickConfirmed) => {
                // 1. Validate Price Levels immediately
                let risk, reward, rr;
                
                if (type === 'BUY') {
                    // Force Logic: SL must be below Entry, TP must be above Entry
                    if (sl >= entry) sl = entry - (atr * 1.5); // Auto-fix SL if wrong
                    if (tp <= entry) tp = entry + (entry - sl) * 1.5; // Auto-fix TP if wrong
                    
                    risk = entry - sl;
                    reward = tp - entry;
                } else { // SELL
                    // Force Logic: SL must be above Entry, TP must be below Entry
                    if (sl <= entry) sl = entry + (atr * 1.5); // Auto-fix SL if wrong
                    if (tp >= entry) tp = entry - (sl - entry) * 1.5; // Auto-fix TP if wrong
                    
                    risk = sl - entry;
                    reward = entry - tp;
                }

                rr = reward / risk;
                
                // Filter: Only show if RR is decent and levels are valid
                if(rr < 1.2) return; 

                // V29 FIX: Distance Check (Don't show signal if price is way too far from entry)
                const distPercent = Math.abs(currentPrice - entry) / currentPrice * 100;
                if(distPercent > 2.0) return; // Ignore if entry is > 2% away

                patterns.push({
                    type, name, score: Math.min(100, baseScore + (wickConfirmed ? 5 : 0)),
                    entry, sl, tp, desc, tf: tfLabel, rr: rr.toFixed(2),
                    category: category, wickConfirmed: wickConfirmed
                });
            };
            function checkWickTouch(level, type, lookback = 10) {
                let touched = false;
                const buffer = atr * 0.5;
                for(let k = lastCloseIdx; k > lastCloseIdx - lookback; k--) {
                    const cOpen = series.open[k];
                    const cClose = series.close[k];
                    const cHigh = series.high[k];
                    const cLow = series.low[k];
                    if(type === 'BUY') {
                        if(cLow <= level + buffer && cLow >= level - (buffer*2) && cClose > level) { touched = true; break; }
                    } else {
                        if(cHigh >= level - buffer && cHigh <= level + (buffer*2) && cClose < level) { touched = true; break; }                    }
                }
                return touched;
            }

            // QM Logic
            if(pivots.length >= 4) {
                for(let i = pivots.length - 4; i >= Math.max(0, pivots.length - 15); i--) {
                    const p1 = pivots[i]; const p2 = pivots[i+1]; const p3 = pivots[i+2]; const p4 = pivots[i+3];
                    if(p1.type === 'high' && p2.type === 'low' && p3.type === 'high' && p4.type === 'low') {
                        if(p3.price > p1.price && p4.price < p2.price) {
                            const qmLevel = p1.price;
                            if(currentPrice < qmLevel + (atr * 1.5) && currentPrice > qmLevel - (atr * 0.5)) {
                                const target = p4.price;
                                const wickTouch = checkWickTouch(qmLevel, 'SELL');
                                // V29: Ensure Target is actually below QM Level for Sell
                                let finalTp = target;
                                if(finalTp >= qmLevel) finalTp = qmLevel - (qmLevel - p4.price); 
                                
                                addPattern('SELL', 'Bearish QM', wickTouch ? 98 : 90, qmLevel, p3.price + (atr * 0.5), finalTp, wickTouch ? "QM with Liquidity Sweep." : "Standard QM.", 'SCALP', wickTouch);                            }
                        }
                    }
                    if(p1.type === 'low' && p2.type === 'high' && p3.type === 'low' && p4.type === 'high') {
                        if(p3.price < p1.price && p4.price > p2.price) {
                            const qmLevel = p1.price;
                            if(currentPrice > qmLevel - (atr * 1.5) && currentPrice < qmLevel + (atr * 0.5)) {
                                const target = p4.price;
                                const wickTouch = checkWickTouch(qmLevel, 'BUY');
                                // V29: Ensure Target is actually above QM Level for Buy
                                let finalTp = target;
                                if(finalTp <= qmLevel) finalTp = qmLevel + (p4.price - qmLevel);

                                addPattern('BUY', 'Bullish QM', wickTouch ? 98 : 90, qmLevel, p3.price - (atr * 0.5), finalTp, wickTouch ? "QM with Liquidity Sweep." : "Standard QM.", 'SCALP', wickTouch);
                            }
                        }
                    }
                }
            }
            // OB Logic
            for(let i = pivots.length - 2; i >= Math.max(0, pivots.length - 10); i--) {
                const p = pivots[i];
                if(p.type === 'low') {
                    const moveSize = series.high[p.index + 5] - p.price; 
                    if(moveSize > atr * 2.5) { 
                        const obPrice = series.low[p.index]; const obHigh = series.high[p.index];
                        if(currentPrice > obPrice && currentPrice < obHigh + (atr * 0.5)) {
                             let nextHigh = 0;
                             for(let k=pivots.length-1; k>i; k++) { if(pivots[k].type === 'high' && pivots[k].price > currentPrice) { nextHigh = pivots[k].price; break; } }
                             if(nextHigh === 0) nextHigh = currentPrice + (moveSize * 0.618); 
                             const wickTouch = checkWickTouch(obHigh, 'BUY');
                             addPattern('BUY', 'Bullish OB', wickTouch ? 99 : 92, obHigh, obPrice - (atr * 0.5), nextHigh, wickTouch ? "OB Tapped & Rejected." : "Unmitigated OB.", 'SNIPER', wickTouch);
                        }
                    }
                }
                if(p.type === 'high') {
                    const moveSize = p.price - series.low[p.index + 5];
                    if(moveSize > atr * 2.5) {                        const obPrice = series.high[p.index]; const obLow = series.low[p.index];
                        if(currentPrice < obPrice && currentPrice > obLow - (atr * 0.5)) {
                             let nextLow = 99999999;
                             for(let k=pivots.length-1; k>i; k--) { if(pivots[k].type === 'low' && pivots[k].price < currentPrice) { nextLow = pivots[k].price; break; } }
                             if(nextLow === 99999999) nextLow = currentPrice - (moveSize * 0.618);
                             const wickTouch = checkWickTouch(obLow, 'SELL');
                             addPattern('SELL', 'Bearish OB', wickTouch ? 99 : 92, obLow, obPrice + (atr * 0.5), nextLow, wickTouch ? "OB Tapped & Rejected." : "Unmitigated OB.", 'SNIPER', wickTouch);
                        }
                    }
                }
            }
            // SBR/RBS Logic
            for(let i = 0; i < pivots.length - 3; i++) {
                const p = pivots[i];
                if(p.type === 'high') {                    const resLevel = p.price; let broken = false;
                    for(let j = i+1; j < lastCloseIdx; j++) { if(series.close[j] > resLevel) { broken = true; break; } }
                    if(broken && currentPrice > resLevel && currentPrice < resLevel + (atr * 1.5)) {
                        let target = 0; for(let k=i+1; k<pivots.length; k++) { if(pivots[k].type === 'high') { target = pivots[k].price; break; } }
                        if(target === 0) target = currentPrice + (atr * 5);
                        const wickTouch = checkWickTouch(resLevel, 'BUY');
                        addPattern('BUY', 'RBS Reversal', wickTouch ? 95 : 85, resLevel, resLevel - (atr * 2), target, wickTouch ? "Resistance flipped Support." : "Standard RBS.", 'SCALP', wickTouch);
                    }
                }
                if(p.type === 'low') {
                    const supLevel = p.price; let broken = false;
                    for(let j = i+1; j < lastCloseIdx; j++) { if(series.close[j] < supLevel) { broken = true; break; } }
                    if(broken && currentPrice < supLevel && currentPrice > supLevel - (atr * 1.5)) {
                        let target = 99999999; for(let k=i+1; k<pivots.length; k++) { if(pivots[k].type === 'low') { target = pivots[k].price; break; } }
                        if(target === 99999999) target = currentPrice - (atr * 5);
                        const wickTouch = checkWickTouch(supLevel, 'SELL');
                        addPattern('SELL', 'SBR Reversal', wickTouch ? 95 : 85, supLevel, supLevel + (atr * 2), target, wickTouch ? "Support flipped Resistance." : "Standard SBR.", 'SCALP', wickTouch);
                    }                }
            }
            return patterns;
        }

        function formatPrice(price) {
            if(!price) return "-";
            if(price > 100) return price.toFixed(2);
            if(price > 1) return price.toFixed(3);
            return price.toFixed(5);
        }

        function checkFreshness(setup, currentPrice) {
            if (!setup || !currentPrice) return { status: 'UNKNOWN', text: 'WAITING PRICE', class: 'fresh-late' };
            const buffer = Math.abs(setup.entry - setup.sl) * 0.3; 
            if (setup.type === 'BUY') {
                if (currentPrice < setup.sl) return { status: 'INVALID', text: 'SL HIT', class: 'fresh-bad' };
                if (currentPrice > setup.tp) return { status: 'INVALID', text: 'TP HIT', class: 'fresh-bad' };                if (currentPrice >= setup.entry && currentPrice <= (setup.entry + buffer * 2)) return { status: 'FRESH', text: 'LIMIT READY', class: 'fresh-ok' };
                if (currentPrice < setup.entry && currentPrice > setup.sl) return { status: 'ACTIVE', text: 'IN TRADE', class: 'fresh-ok' };
                if (currentPrice > setup.entry + buffer * 2) return { status: 'LATE', text: 'TOO FAR', class: 'fresh-late' };
            } else {
                if (currentPrice > setup.sl) return { status: 'INVALID', text: 'SL HIT', class: 'fresh-bad' };
                if (currentPrice < setup.tp) return { status: 'INVALID', text: 'TP HIT', class: 'fresh-bad' };
                if (currentPrice <= setup.entry && currentPrice >= (setup.entry - buffer * 2)) return { status: 'FRESH', text: 'LIMIT READY', class: 'fresh-ok' };
                if (currentPrice > setup.entry && currentPrice < setup.sl) return { status: 'ACTIVE', text: 'IN TRADE', class: 'fresh-ok' };
                if (currentPrice < setup.entry - buffer * 2) return { status: 'LATE', text: 'TOO FAR', class: 'fresh-late' };
            }
            return { status: 'UNKNOWN', text: 'CALCULATING...', class: 'fresh-late' };
        }

        function showToast(title, message, type = 'info') {            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');            
            let iconClass = 'fa-info-circle';
            let alertClass = 'alert-success';
            if (type === 'error') { iconClass = 'fa-exclamation-triangle'; alertClass = 'alert-danger'; }
            toast.className = `toast-alert ${alertClass}`;
            toast.innerHTML = `
                <div class="toast-icon"><i class="fas ${iconClass}"></i></div>
                <div class="toast-content">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            `;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 4000);
        }
        async function startNewScan() {
            const input = document.getElementById('symbolInput');
            let rawSymbol = input.value.toUpperCase().trim();
            
            // Normalize Input for Crypto Focus
            if(SYMBOL_MAP[rawSymbol]) { 
                currentSymbol = rawSymbol; 
                assetType = SYMBOL_MAP[rawSymbol].type; 
            } else {
                // If user types "BTC", assume "BTCUSDT"
                if(!rawSymbol.endsWith("USDT")) {
                    rawSymbol += "USDT";
                }
                currentSymbol = rawSymbol;
                assetType = "crypto";
            }            
            document.getElementById('mainSymbolDisplay').innerText = currentSymbol;
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('scanBtn').disabled = true;
            document.getElementById('scanStatus').innerHTML = '<i class="fas fa-circle" style="font-size:8px; color:var(--accent-blue);"></i>';
            resetValues();

            if(priceInterval) clearInterval(priceInterval);

            try {
                updateSessionTracker();
                initTV(currentSymbol);
                await updateLivePrice();
                priceInterval = setInterval(updateLivePrice, 3000);
                const promises = TIMEFRAMES.map(tf => fetchTimeframeData(tf));
                const results = await Promise.all(promises);
                renderCards(results);
                renderStrategicGrid(results); 
                showToast("SCAN COMPLETE", `Analysis for ${currentSymbol} finished.`, "timeframe");
            } catch (e) {
                console.error(e);
                showToast("SYSTEM ERROR", "Failed to fetch market data.", "error");
            } finally {
                document.getElementById('loader').style.display = 'none';                document.getElementById('scanBtn').disabled = false;
                document.getElementById('scanStatus').innerHTML = '<i class="fas fa-circle" style="font-size:8px; color:var(--bull-color);"></i>';
            }
        }

        async function updateLivePrice() {
            try {
                let fetchedPrice = 0;
                const mapData = SYMBOL_MAP[currentSymbol];
                let apiSymbol = "";
                if(mapData) { apiSymbol = mapData.api; }                 else {
                    // Fallback for any crypto pair
                    apiSymbol = currentSymbol.endsWith("USDT") ? currentSymbol : currentSymbol + "USDT";
                }

                const ticker = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${apiSymbol}`);
                if(ticker.ok) {
                    const priceJson = await ticker.json();
                    fetchedPrice = parseFloat(priceJson.price);
                }
                                
                if(fetchedPrice > 0) {
                    currentLivePrice = fetchedPrice;
                    const dec = mapData ? mapData.decimals : 2;
                    document.getElementById('mainPrice').innerText = fetchedPrice.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
                    checkAndRefreshSetup();                    updateMainPanelFreshness();
                }
            } catch(e) { console.log("Ticker error", e); }
        }

        function checkAndRefreshSetup() {
            const recEntry = document.getElementById('recEntry').innerText;
            const recTP = document.getElementById('recTP').innerText;
            const recSL = document.getElementById('recSL').innerText;
            const sigType = document.getElementById('signalType').innerText;

            if(recEntry !== '-' && currentLivePrice > 0) {
                const entry = parseFloat(recEntry.replace(/,/g, ''));
                const tp = parseFloat(recTP.replace(/,/g, ''));
                const sl = parseFloat(recSL.replace(/,/g, ''));
                let hitTarget = false; let reason = "";
                if(sigType.includes("BUY")) {
                    if(currentLivePrice >= tp) { hitTarget = true; reason = "TP HIT"; }
                    if(currentLivePrice <= sl) { hitTarget = true; reason = "SL HIT"; }
                } else if (sigType.includes("SELL")) {
                    if(currentLivePrice <= tp) { hitTarget = true; reason = "TP HIT"; }
                    if(currentLivePrice >= sl) { hitTarget = true; reason = "SL HIT"; }
                }                if(hitTarget) {
                    showToast("TARGET REACHED", `${reason}: Searching for new opportunity...`, "warning");
                    resetValues(); bestSetupId = null; updateConfirmButton(null);
                }
            }
        }

        async function fetchTimeframeData(tfObj) {
            try {
                let rawData = [];
                const mapData = SYMBOL_MAP[currentSymbol];
                let apiSymbol = "";
                if(mapData) { apiSymbol = mapData.api; }                 else {
                    apiSymbol = currentSymbol.endsWith("USDT") ? currentSymbol : currentSymbol + "USDT";
                }
                
                const url = `https://api.binance.com/api/v3/klines?symbol=${apiSymbol}&interval=${tfObj.interval}&limit=1000`;
                const response = await fetch(url);
                if(!response.ok) return null;
                rawData = await response.json();
                if(!rawData || rawData.length < 50) return null;

                const series = getSeries(rawData);
                let trs = [];
                for(let i=1; i<series.close.length; i++) {
                    let tr1 = series.high[i] - series.low[i];
                    let tr2 = Math.abs(series.high[i] - series.close[i-1]);                    let tr3 = Math.abs(series.low[i] - series.close[i-1]);
                    trs.push(Math.max(tr1, tr2, tr3));
                }
                const atr = trs.slice(-14).reduce((a,b)=>a+b,0) / 14 || 0.0001;
                const pivotRange = ['1m','5m'].includes(tfObj.label) ? 3 : 5;
                const pivots = findFractalPivots(series, pivotRange);
                const patterns = detectPatterns(series, pivots, atr, tfObj.label);
                const bestPattern = patterns.sort((a,b) => b.score - a.score)[0];
                return { tf: tfObj.label, price: series.close[series.close.length-1], pattern: bestPattern || null, allPatterns: patterns, series: series, pivots: pivots, atr: atr };
            } catch (e) { console.error("Fetch Error:", e); return null; }
        }

        function renderCards(allData) {
            const container = document.getElementById('tfContainer');
            container.innerHTML = '';
            scanResultsData = {}; 
            let globalBestSetup = null; let highestScore = 0; let buyCount = 0; let sellCount = 0;

            allData.forEach(d => {
                if(!d) return;
                const p = d.pattern;                scanResultsData[d.tf] = d;
                let badgeClass = 'sig-wait'; let cardClass = ''; let signalText = 'Wait'; let probClass = 'fill-low';
                if (p) {
                    signalText = p.name.split(' ')[0];
                    badgeClass = p.type === 'BUY' ? 'sig-buy' : 'sig-sell';
                    cardClass = 'has-pattern';
                    if(p.type === 'BUY') buyCount++;
                    if(p.type === 'SELL') sellCount++;
                    if(p.score >= 80) probClass = 'fill-high';
                    else if(p.score >= 60) probClass = 'fill-med';
                    if(p.score > highestScore) { highestScore = p.score; globalBestSetup = { ...p, tf: d.tf }; }
                }
                const card = document.createElement('div');
                card.className = `tf-card ${cardClass}`;
                if(globalBestSetup && globalBestSetup.tf === d.tf) card.classList.add('best-choice');
                card.onclick = () => openModal(d.tf);                card.innerHTML = `
                    <div class="tf-label">${d.tf}</div>
                    <span class="signal-badge ${badgeClass}">${signalText}</span>
                    <div class="prob-meter"><div class="prob-fill ${probClass}" style="width:${p ? p.score : 0}%"></div></div>
                `;
                container.appendChild(card);
            });
            updateMainPanel(globalBestSetup, buyCount, sellCount);
        }

        function renderStrategicGrid(allData) {
            const container = document.getElementById('stratContainer');
            container.innerHTML = '';
            strategicLevels = [];            allData.forEach(d => {
                if(!d || !d.allPatterns) return;
                d.allPatterns.forEach(pat => { if(pat.score > 85) strategicLevels.push(pat); });
            });
            strategicLevels.sort((a,b) => b.score - a.score);
            const topLevels = strategicLevels.slice(0, 4);
            if(topLevels.length === 0) {
                container.innerHTML = `<div style="padding:15px; text-align:center; color:#555; font-size:11px;">NO INSTITUTIONAL LEVELS DETECTED</div>`;
                return;
            }
            if(strategicLevels.length > 0) showToast("LEVELS FOUND", `${strategicLevels.length} Institutional setups detected.`, "smc");

            topLevels.forEach((lvl, index) => {
                const card = document.createElement('div');
                card.className = 'strat-card';
                if(lvl.name.includes("QM")) card.setAttribute('data-type', 'QM');
                else if(lvl.name.includes("Block")) card.setAttribute('data-type', 'SNIPER');
                card.onclick = () => openStratModal(index);
                const isBuy = lvl.type === 'BUY';
                const color = isBuy ? 'var(--bull-color)' : 'var(--bear-color)';                const freshData = checkFreshness(lvl, currentLivePrice);
                card.innerHTML = `
                    <div class="strat-info">
                        <span class="strat-type" style="color:${color}">${lvl.type} • ${lvl.category}</span>
                        <span class="strat-desc">${lvl.name}</span>
                        ${lvl.wickConfirmed ? '<span class="wick-valid"><i class="fas fa-check"></i> WICK CONFIRMED</span>' : ''}
                    </div>
                    <div class="strat-price-box">
                        <div class="strat-price">${formatPrice(lvl.entry)}</div>
                        <span class="strat-tf">${lvl.tf}</span>
                        <div style="margin-top:4px;"><span class="fresh-badge ${freshData.class}">${freshData.text}</span></div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function updateMainPanel(setup, buyCount, sellCount) {            const typeEl = document.getElementById('signalType');
            const panel = document.getElementById('mainPanel');
            const trendBadge = document.getElementById('trendBadge');
            let bias = "NEUTRAL";
            if(buyCount > sellCount + 1) { bias = "UPTREND"; trendBadge.className = "trend-pill pill-up"; trendBadge.innerText = "BULLISH"; } 
            else if (sellCount > buyCount + 1) { bias = "DOWNTREND"; trendBadge.className = "trend-pill pill-down"; trendBadge.innerText = "BEARISH"; } 
            else { bias = "SIDEWAYS"; trendBadge.className = "trend-pill pill-neutral"; trendBadge.innerText = "CONSOLIDATION"; }
            globalTrend = bias;
            
            if (!setup) {
                typeEl.innerText = "NO SETUP"; typeEl.style.color = "#848e9c";
                document.getElementById('recLogic').innerText = `Market structure unclear. Wait for Wick Confirmation. Trend: ${globalTrend}.`;
                bestSetupId = null; updateConfirmButton(null); resetValues(); return;            }

            const isBuy = setup.type === "BUY";
            let isValid = true; let reason = "";
            if(bias === "SIDEWAYS") { if(setup.name.includes("Block") && setup.score < 95) { isValid = false; reason = "Avoiding Trend Continuation in Sideways."; } } 
            else {
                if(setup.name.includes("QM")) {
                    if(isBuy && bias === "DOWNTREND" && setup.score < 95) { isValid = false; reason = "Counter-trend QM in Downtrend."; } 
                    else if (!isBuy && bias === "UPTREND" && setup.score < 95) { isValid = false; reason = "Counter-trend QM in Uptrend."; }
                }
            }

            if(!isValid) {
                typeEl.innerText = "WAIT"; typeEl.style.color = "#848e9c";
                document.getElementById('recLogic').innerHTML = `<strong style="color:var(--gold-accent)">CONFLICT:</strong> ${reason} (${bias}).`;
                bestSetupId = null; updateConfirmButton(null); resetValues(); return;
            }

            bestSetupId = `${currentSymbol}_${setup.tf}_${setup.type}_${formatPrice(setup.entry)}`;            typeEl.innerText = setup.type; typeEl.style.color = isBuy ? "var(--bull-color)" : "var(--bear-color)";
            document.getElementById('recEntry').innerText = formatPrice(setup.entry);
            document.getElementById('recTP').innerText = formatPrice(setup.tp);
            document.getElementById('recSL').innerText = formatPrice(setup.sl);
            document.getElementById('recRR').innerText = `1:${setup.rr}`;
            document.getElementById('recLogic').innerHTML = `<strong style="color:${isBuy ? 'var(--bull-color)' : 'var(--bear-color)'}">${setup.name} (${setup.tf})</strong> • Score: ${setup.score}/100<br>${setup.desc}`;
            updateMainPanelFreshness(); updateConfirmButton(bestSetupId);
        }
        
        function resetValues() {
            ['recEntry', 'recTP', 'recSL', 'recRR'].forEach(id => document.getElementById(id).innerText = '-');
            document.getElementById('recFreshness').innerText = "WAITING";
            document.getElementById('recFreshness').className = "fresh-badge fresh-late";
        }

        function updateMainPanelFreshness() {
            const entryTxt = document.getElementById('recEntry').innerText;
            const tpTxt = document.getElementById('recTP').innerText;
            const slTxt = document.getElementById('recSL').innerText;
            const typeTxt = document.getElementById('signalType').innerText;            const badge = document.getElementById('recFreshness');
            if(entryTxt === '-' || currentLivePrice === 0) return;
            const entry = parseFloat(entryTxt.replace(/,/g, ''));
            const tp = parseFloat(tpTxt.replace(/,/g, ''));
            const sl = parseFloat(slTxt.replace(/,/g, ''));
            const tempSetup = { entry: entry, tp: tp, sl: sl, type: typeTxt.includes("BUY") ? "BUY" : "SELL" };
            const fresh = checkFreshness(tempSetup, currentLivePrice);
            badge.innerText = fresh.text; badge.className = `fresh-badge ${fresh.class}`;
        }

        function toggleConfirmSetup() {
            if (!bestSetupId) return;            const btn = document.getElementById('confirmBtn');
            const isConfirmed = btn.classList.contains('btn-taken');
            if (!isConfirmed) {
                localStorage.setItem(`scalper_conf_${bestSetupId}`, Date.now().toString());
                updateConfirmButton(bestSetupId);
            } else {
                if(confirm("Cancel confirmation?")) {
                    localStorage.removeItem(`scalper_conf_${bestSetupId}`);
                    updateConfirmButton(bestSetupId);
                }
            }
        }

        function updateConfirmButton(id) {
            const btn = document.getElementById('confirmBtn');
            if (!id) { btn.className = "btn-action btn-ready"; btn.innerHTML = "CONFIRM ENTRY"; btn.disabled = true; btn.style.opacity = "0.5"; return; }
            btn.disabled = false; btn.style.opacity = "1";
            const savedTime = localStorage.getItem(`scalper_conf_${id}`);            if (savedTime) { btn.className = "btn-action btn-taken"; } 
            else { btn.className = "btn-action btn-ready"; btn.innerHTML = "CONFIRM ENTRY"; }
        }

        function updateTimers() {
            if (!bestSetupId) return;
            const savedTime = localStorage.getItem(`scalper_conf_${bestSetupId}`);
            const btn = document.getElementById('confirmBtn');
            if (savedTime && btn.classList.contains('btn-taken')) {
                const diffMs = Date.now() - parseInt(savedTime);
                const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
                const hours = Math.floor((diffMs / (1000 * 60 * 60)));
                const timeStr = (hours > 0 ? hours + "h " : "") + (minutes < 10 ? "0" + minutes : minutes) + "m";
                btn.innerHTML = `POSITION ACTIVE: ${timeStr}`;
            }
        }
        setInterval(updateTimers, 1000);

        function openModal(tfLabel) {
            const data = scanResultsData[tfLabel];
            const modal = document.getElementById('signalModal');
            document.getElementById('modalTf').innerText = tfLabel;            if(data && data.pattern) {
                const p = data.pattern;
                const isBuy = p.type === 'BUY';
                document.getElementById('modalSignalTitle').innerText = p.type + " SIGNAL";
                document.getElementById('modalSignalTitle').style.color = isBuy ? 'var(--bull-color)' : 'var(--bear-color)';
                document.getElementById('modalDesc').innerText = p.desc;
                document.getElementById('modalEntry').innerText = formatPrice(p.entry);
                document.getElementById('modalTP').innerText = formatPrice(p.tp);
                document.getElementById('modalSL').innerText = formatPrice(p.sl);
                document.getElementById('modalRR').innerText = `1 : ${p.rr}`;
                const fresh = checkFreshness(p, currentLivePrice);                const mFresh = document.getElementById('modalFresh');
                mFresh.innerText = fresh.text; mFresh.className = `fresh-badge ${fresh.class}`;
            } else {
                document.getElementById('modalSignalTitle').innerText = "NO SIGNAL";
                document.getElementById('modalSignalTitle').style.color = '#848e9c';
                document.getElementById('modalDesc').innerText = "No clear pattern detected on this timeframe.";
                ['modalEntry','modalTP','modalSL','modalRR'].forEach(id => document.getElementById(id).innerText = "-");
                document.getElementById('modalFresh').innerText = "N/A";
                document.getElementById('modalFresh').className = "fresh-badge fresh-late";
            }
            modal.classList.add('active');
        }

        function openStratModal(index) {
            const strat = strategicLevels[index];
            const modal = document.getElementById('signalModal');
            document.getElementById('modalTf').innerText = strat.tf;            const isBuy = strat.type === 'BUY';
            document.getElementById('modalSignalTitle').innerText = strat.type + " • " + strat.name;
            document.getElementById('modalSignalTitle').style.color = isBuy ? 'var(--bull-color)' : 'var(--bear-color)';
            document.getElementById('modalDesc').innerText = strat.desc + " (Key Level Detected)";
            document.getElementById('modalEntry').innerText = formatPrice(strat.entry);
            document.getElementById('modalTP').innerText = formatPrice(strat.tp);
            document.getElementById('modalSL').innerText = formatPrice(strat.sl);
            document.getElementById('modalRR').innerText = `1 : ${strat.rr}`;
            const fresh = checkFreshness(strat, currentLivePrice);
            const mFresh = document.getElementById('modalFresh');
            mFresh.innerText = fresh.text; mFresh.className = `fresh-badge ${fresh.class}`;
            modal.classList.add('active');
        }

        function closeModal() { document.getElementById('signalModal').classList.remove('active'); }
        
        function applyToChart() {
            const tfLabel = document.getElementById('modalTf').innerText;
            const tfObj = TIMEFRAMES.find(t => t.label === tfLabel);
            if(tfObj) {
                let tvInterval = tfObj.interval.replace('m','').replace('h','').replace('d','D');
                if(tvInterval === '1') tvInterval = '1';
                initTV(currentSymbol, tvInterval);
                closeModal();            }
        }

        let soundEnabled = false;
        let currentTrackIndex = 1;
        const totalTracks = 6;
        const audioPlayer = new Audio();
        let soundLoopTimer = null;
        const TRACK_DELAY = 2000;
                function toggleSoundSystem() {
            const avatar = document.getElementById('avatarBtn');
            const statusText = document.getElementById('soundText');
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                avatar.classList.add('sound-on');
                statusText.innerText = "AUDIO ON"; statusText.style.opacity = 1;
                playNextTrack();
            } else {
                avatar.classList.remove('sound-on');
                statusText.innerText = "AUDIO OFF";
                audioPlayer.pause(); clearTimeout(soundLoopTimer);
            }
            setTimeout(() => { statusText.style.opacity = 0; }, 2000);
        }
        function playNextTrack() {
            if (!soundEnabled) return;
            const fileName = `${currentTrackIndex}.mp3`;
            audioPlayer.src = fileName;
            audioPlayer.play().catch(error => { console.log("Audio playback failed:", error); scheduleNextTrack(); });
            audioPlayer.onended = () => { scheduleNextTrack(); };
        }
        function scheduleNextTrack() {
            if (!soundEnabled) return;
            currentTrackIndex++;
            if (currentTrackIndex > totalTracks) currentTrackIndex = 1;
            soundLoopTimer = setTimeout(() => { playNextTrack(); }, TRACK_DELAY);
        }

        function updateSessionTracker() {
            const now = new Date();
            const utcHour = now.getUTCHours();
            const container = document.getElementById('sessionContainer');
            container.innerHTML = '';
            let activeCount = 0;
            SESSIONS.forEach(sess => {
                let isActive = false;
                if (sess.start > sess.end) { isActive = (utcHour >= sess.start || utcHour < sess.end); } 
                else { isActive = (utcHour >= sess.start && utcHour < sess.end); }
                if(isActive) activeCount++;
                const div = document.createElement('div');                div.className = `sess-item ${isActive ? 'active' : ''}`;
                div.style.color = sess.color;
                div.innerHTML = `<div class="sess-dot"></div><span>${sess.name}</span>`;
                container.appendChild(div);
            });
            if(activeCount >= 2) showToast("HIGH VOLATILITY", "Major Session Overlap Detected.", "warning");
            else if (activeCount === 0) showToast("LOW VOLATILITY", "Market Closed / Low Volume.", "info");
        }
        window.onload = () => { initTV(); startNewScan(); };