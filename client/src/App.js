import React, {Component} from "react";
import CodeMirror from "react-codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "./App.css";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import Api from "./api";
import Col from "react-bootstrap/es/Col";
import config from "./config";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {htmlValue: null, key: 0};
        this.loginPageUrl = config.loginPageUrl
    }

    componentDidMount() {
        const self = this;

        Api.getCustomLoginPage()
            .then(customLoginPage => {
                self.setState(state => ({htmlValue: customLoginPage, key: state.key + 1}));
            });
    }

    onClick = () => {
        Api.setCustomLoginPage(this.state.htmlValue)
            .then(console.log)
            .then(() => {
                this.iframe.src = this.iframe.src;
            });
    };

    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <Col xs={6}>
                        <CodeMirror className="editor"
                                    value={this.state.htmlValue}
                                    onChange={(value) => this.setState({htmlValue: value})}
                                    options={{
                                        mode: 'htmlmixed',
                                        lineNumbers: true
                                    }}
                                    key={this.state.key}
                        />
                        <Button onClick={this.onClick}>Save</Button>
                    </Col>
                    <Col xs={6}>
                        <Button href={this.loginPageUrl} target="_blank">Open live version</Button>
                        <iframe
                            id="custom-login-page-preview"
                            ref={iframe => {
                                this.iframe = iframe;
                            }}
                            title="custom_login_page_preview"
                            src={this.loginPageUrl}>
                        </iframe>
                    </Col>
                </div>
            </div>
        );
    }
}

export default App;
