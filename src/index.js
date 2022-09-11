import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import { Provider } from 'react-redux';
import App from './App';
import GlobalStyle from '~/Components/GlobalStyle';
import Store from './Redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={Store}>
            <HelmetProvider>
                <GlobalStyle>
                    <App />
                </GlobalStyle>
            </HelmetProvider>
        </Provider>
    </React.StrictMode>,
);
