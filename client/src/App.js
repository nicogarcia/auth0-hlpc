import React, {Component} from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "./App.css";
import Col from "react-bootstrap/es/Col";
import Editor from "./ui/editor/Editor";
import Preview from "./ui/preview/Preview";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <Col xs={6}>
                        <Editor/>
                    </Col>
                    <Col xs={6}>
                        <Preview />
                    </Col>
                </div>
            </div>
        );
    }
}

export default App;
