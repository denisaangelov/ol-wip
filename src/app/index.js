import 'bootstrap';

import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';

import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import rootReducer from './reducers';

// import TLContainer from './components/map-container';
import TLContainer from './components/app';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = [routerMiddleware(history), thunk];

// Enable Redux Devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
    rootReducer,
    /* preloadedState, */
    composeEnhancers(
        applyMiddleware(...middleware)
    )
);

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                { /* ConnectedRouter will use the store from Provider automatically */}
                <ConnectedRouter history={history}>
                    <Component />
                </ConnectedRouter>
            </Provider>
        </AppContainer>,
        document.getElementById('container')
    );
};

render(TLContainer);

if (module.hot) {
    module.hot.accept(
        './components/map-container',
        () => {
            render(TLContainer);
        }
    );
}

$('.ol-zoom-in, .ol-zoom-out, .ol-overviewmap > button[title]').tooltip({
    container: 'body',
    placement: 'right'
});