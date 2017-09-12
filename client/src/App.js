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

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {htmlValue: null, key: 0};
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
                        <iframe
                            id="custom-login-page-preview"
                            ref={iframe => {
                                this.iframe = iframe;
                            }}
                            title="custom_login_page_preview"
                            src="https://test-xr4.auth0.com/login?client=BgPq4dvkYKOw6M3aFXFvy0sIhPeVzs45">
                        </iframe>
                    </Col>
                </div>
            </div>
        );
    }
}

export default App;
