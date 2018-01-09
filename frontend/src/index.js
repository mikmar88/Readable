import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux'
import post from './reducers'
import registerServiceWorker from './registerServiceWorker';

export const REACT_APP_BACKEND = 'http://localhost:3001'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(post, composeEnhancers(
    applyMiddleware(thunk)
  ))

ReactDOM.render(<Provider store={store}>
                	<BrowserRouter>
                		<App />
                	</BrowserRouter>
                </Provider>, 
                document.getElementById('root'));
registerServiceWorker();
