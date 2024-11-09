import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbols }) {
  const miniStocksContainer = useRef(null);
  const stocksContainer = useRef(null);
  const miniStocksScriptRef = useRef(null);
  const stocksScriptRef = useRef(null);

  useEffect(() => {
    // Helper function to create and append a script
    const appendScript = (containerRef, scriptSrc, config, scriptRef) => {
      if (containerRef.current && !scriptRef.current) {
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.type = "text/javascript";
        script.async = true;

        // Properly format the configuration as a string
        script.innerHTML = `
          ${JSON.stringify(config).replace(/\\/g, '')}
        `;

        containerRef.current.appendChild(script);
        scriptRef.current = script;
      }
    };

    // Configuration for Mini Symbol Overview Widget
    const miniStocksConfig = {
      "symbol": "SENSEX",
      "width": "100%",
      "height": 300,
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": "light",
      "isTransparent": false,
      "autosize": true,
      "largeChartUrl": ""
    };

    // Configuration for Stocks Overview Widget
    const stocksConfig = {
      "symbols": symbols || [
        ["Reliance Industries", "NSE:RELIANCE|1D"],
        ["Tata Consultancy Services", "NSE:TCS|1D"],
        ["HDFC Bank", "NSE:HDFCBANK|1D"],
        ["Infosys", "NSE:INFY|1D"],
        ["ICICI Bank", "NSE:ICICIBANK|1D"]
      ],
      "chartOnly": false,
      "width": "100%",
      "height": 500,
      "locale": "en",
      "colorTheme": "light",
      "autosize": true,
      "showVolume": false,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "fontSize": "10",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "maLineColor": "#2962FF",
      "maLineWidth": 1,
      "maLength": 9,
      "headerFontSize": "small",
      "lineWidth": 1,
      "lineType": 0,
      "dateRanges": [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ]
    };

    // Append Mini Symbol Overview Script
    appendScript(
      miniStocksContainer,
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js",
      miniStocksConfig,
      miniStocksScriptRef
    );

    // Append Stocks Overview Script
    appendScript(
      stocksContainer,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
      stocksConfig,
      stocksScriptRef
    );

    // Cleanup function to remove scripts
    return () => {
      if (miniStocksScriptRef.current && miniStocksContainer.current) {
        miniStocksContainer.current.removeChild(miniStocksScriptRef.current);
        miniStocksScriptRef.current = null;
      }
      if (stocksScriptRef.current && stocksContainer.current) {
        stocksContainer.current.removeChild(stocksScriptRef.current);
        stocksScriptRef.current = null;
      }
    };
  }, [symbols]);

  return (
    <div className='w-full' style={{ margin: '0 auto', padding: '20px' }}>
      {/* Mini Symbol Overview */}
      <div
        className="tradingview-widget-container"
        ref={miniStocksContainer}
        style={{ height: "300px", width: "100%", marginBottom: '20px' }}
      ></div>

      {/* Stocks Overview */}
      <div
        className="tradingview-widget-container"
        ref={stocksContainer}
        style={{ height: "500px", width: "100%" }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
