// import React from 'react';
// import ReactDOM from 'react-dom';
// import { HelmetProvider } from 'react-helmet-async';

// import { Provider } from 'react-redux';
// import App from './App';
// import GlobalStyle from '~/Components/GlobalStyle';
// import Store from './Redux/store';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <Provider store={Store}>
//         <HelmetProvider>
//             <GlobalStyle>
//                 <App />
//             </GlobalStyle>
//         </HelmetProvider>
//     </Provider>,
// );

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import Store from './Redux/store';
import GlobalStyle from '~/Components/GlobalStyle';

import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={Store}>
            <HelmetProvider>
                <GlobalStyle>
                    <App />
                </GlobalStyle>
            </HelmetProvider>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'),
);
