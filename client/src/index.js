import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "codemirror/lib/codemirror.css";
import {observable} from "mobx";

import App from "./App";

let store = observable({
    editor: {collapsed: true}
});

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
