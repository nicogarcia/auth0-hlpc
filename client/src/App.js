import React, {Component} from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "./App.css";
import Col from "react-bootstrap/es/Col";
import Editor from "./ui/editor/Editor";
import Preview from "./ui/preview/Preview";
import {observer, PropTypes} from "mobx-react";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <Col xs={4} hidden={this.props.store.editor.collapsed}>
                        <Editor editor={this.props.store.editor} preview={this.props.store.preview}/>
                    </Col>

                    <Col xs={this.props.store.editor.collapsed ? 12 : 8}>
                        <Preview editor={this.props.store.editor} preview={this.props.store.preview}/>
                    </Col>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    store: PropTypes.observableObject.isRequired
};

export default observer(App);
