import React, {Component} from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "./App.css";
import {observer, PropTypes} from "mobx-react";
import config from "./config";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Edit from "./ui/edit/Edit";
import Welcome from "./ui/welcome/Welcome";

class App extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Welcome}/>

                    <Route path="/edit" render={() => (
                        <Edit editor={this.props.store.editor}
                              preview={this.props.store.preview}/>
                    )}/>
                </Switch>
            </Router>
        );
    }
}

App.propTypes = {
    store: PropTypes.observableObject.isRequired
};

export default observer(App);
