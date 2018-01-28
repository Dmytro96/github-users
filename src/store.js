import {createStore} from "redux";
import reducer from "./reducer";
import middleware from "./middleware";
const store = createStore(reducer, middleware);

export default store;

if (module.hot) {
    module.hot.accept(() => {
        const nextRootReducer = require('./reducer').default;
        store.replaceReducer(nextRootReducer);
    })
}
