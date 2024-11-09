import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from "redux-persist";

// Initialize the persistor
let persistor = persistStore(store);

// Global error handling
window.onerror = function (message, source, lineno, colno, error) {
    // Suppress the error logging to the console
    console.warn("Global error captured: ", message);
    // Prevent the default behavior (showing in console)
    return true; // Returning true suppresses the error
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    
);
