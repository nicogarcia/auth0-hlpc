import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "codemirror/lib/codemirror.css";
import {observable, useStrict} from "mobx";

import App from "./App";

useStrict(true);

let store = observable({
    editor: {collapsed: true, htmlEditor: {key: 0}},
    preview: {iframe: null}
});

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
