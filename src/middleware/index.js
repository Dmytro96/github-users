import { applyMiddleware } from "redux";
import axios from "axios";
import logger from 'redux-logger'

const apiMiddleware = store => next => action => {
    if (action.url) {
        const {url, method, type, ...rest} = action;
        let body;

        const REQUEST = `${type}_REQUEST`;
        const SUCCESS = `${type}_SUCCESS`;
        const FAILURE = `${type}_FAILURE`;

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        if (action.body) {
            body = JSON.stringify(action.body)
        }

        next({type: REQUEST, ...rest});

        axios.request({
            baseURL: url,
            method: method || "GET",
            headers,
            timeout: 25000,
            data: body
        })
        .then(data => {
            return next({type: SUCCESS, serverResponse: data.data, ...rest})
        })
        .catch(e => {
            const message = e.response.data.message;
            alert(message);
            return next({type: FAILURE, serverResponse: {
                status: e.response.status,
                message,
                ...rest
            }});
        });

    } else {
        next(action);
    }
};

const middlewares = [apiMiddleware, __DEV__ && logger].filter(Boolean);

export default applyMiddleware(...middlewares);