import React, {Component} from "react";
import Editor from "./editor/Editor";
import {Col, Grid, Row} from "@auth0/styleguide-react-components/lib/index";
import Preview from "./preview/Preview";
import PreviewHeader from "./preview/header/PreviewHeader";
import {observer, PropTypes as mobxPropTypes} from "mobx-react";
import {action} from "mobx";
import config from "../../config";

class Edit extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    onToggleEditor = action(() => {
        this.props.editor.collapsed = !this.props.editor.collapsed;

        // Hack to make editor update its content
        // https://github.com/JedWatson/react-codemirror/issues/106#issuecomment-318781325
        this.props.editor.htmlEditor.key += 1;
    });

    render() {
        return (
            <div className="App">
                <Grid fluid={true} className="container-grid p-0">
                    <Row>
                        <Col xs={12}>
                            <PreviewHeader editorCollapsed={this.props.editor.collapsed}
                                           loginPageUrl={this.loginPageUrl}
                                           onToggleEditor={this.onToggleEditor}
                            />
                        </Col>
                    </Row>
                    <Row className="m-0">
                        <Col xs={this.props.editor.collapsed ? 12 : 8} className="p-0">
                            <Preview loginPageUrl={this.loginPageUrl} preview={this.props.preview}/>
                        </Col>

                        <Col xs={4} hidden={this.props.editor.collapsed} className="p-0">
                            <Editor editor={this.props.editor} preview={this.props.preview}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

Edit.propTypes = {
    editor: mobxPropTypes.observableObject.isRequired,
    preview: mobxPropTypes.observableObject.isRequired
};

export default observer(Edit);
