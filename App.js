import React, {Component} from "react";
import {Provider} from "react-redux";
import UsersList from "./src/Scenes/UsersList";

import store from "./src/store";

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <UsersList/>
            </Provider>
        );
    }
}
