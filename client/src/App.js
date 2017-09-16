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
import {Grid, Row} from "@auth0/styleguide-react-components/lib/index";
import PreviewHeader from "./ui/preview/header/PreviewHeader";
import {action} from "mobx";
import config from "./config";

class App extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    onToggleEditor = action(() => {
        this.props.store.editor.collapsed = !this.props.store.editor.collapsed;

        // Hack to make editor update its content
        // https://github.com/JedWatson/react-codemirror/issues/106#issuecomment-318781325
        this.props.store.editor.htmlEditor.key += 1;
    });

    render() {
        return (
            <div className="App">
                <Grid fluid={true} className="container-grid p-0">
                    <Row>
                        <Col xs={12}>
                            <PreviewHeader editorCollapsed={this.props.store.editor.collapsed}
                                           loginPageUrl={this.loginPageUrl}
                                           onToggleEditor={this.onToggleEditor}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={this.props.store.editor.collapsed ? 12 : 8}>
                            <Preview loginPageUrl={this.loginPageUrl} preview={this.props.store.preview}/>
                        </Col>

                        <Col xs={4} hidden={this.props.store.editor.collapsed}>
                            <Editor editor={this.props.store.editor} preview={this.props.store.preview}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

App.propTypes = {
    store: PropTypes.observableObject.isRequired
};

export default observer(App);
