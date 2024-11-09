import React from 'react';
import TradingViewWidget from './TradingViewWidget';

const ChartPage = () => {
    const stockSymbols = [
        ["Reliance Industries", "BSE:RELIANCE|1D"],
        ["NIFTY","NSE:NIFTY|1D"],
        ["HDFC Bank", "BSE:HDFCBANK|1D"],
        ["Infosys", "BSE:INFY|1D"],
        ["ICICI Bank", "BSE:ICICIBANK|1D"],
        // Add more symbols as needed
    ];

    return (
        <div className="w-[60%]" style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chart Page</h1>
            <TradingViewWidget symbols={stockSymbols} />
        </div>
    );
};

export default ChartPage;
