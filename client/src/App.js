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

    constructor(props) {
        super(props);

        this.state = {editor: {collapsed: true}};
    }

    onToggleCollapseEditor = () => {
        this.setState({editor: {...this.state.editor, collapsed: !this.state.editor.collapsed}})
    };

    render() {
        return (
            <div className="App">
                <div className="container-fluid">
                    <Col xs={4} hidden={this.state.editor.collapsed}>
                        <Editor/>
                    </Col>
                    <Col xs={this.state.editor.collapsed ? 12 : 8}>
                        <Preview onToggleCollapseEditor={this.onToggleCollapseEditor}/>
                    </Col>
                </div>
            </div>
        );
    }
}

export default App;
