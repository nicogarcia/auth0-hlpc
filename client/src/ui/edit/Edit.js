import React, { Component } from "react";
import Editor from "./editor/Editor";
import { Col, Grid, Row } from "@auth0/styleguide-react-components/lib/index";
import Preview from "./preview/Preview";
import PreviewHeader from "./preview/header/PreviewHeader";
import { observer, PropTypes as mobxPropTypes } from "mobx-react";
import { action } from "mobx";
import config from "../../config";
import './Edit.css';

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
            <div className="Edit">
                <div className="Edit__header">
                    <PreviewHeader editorCollapsed={this.props.editor.collapsed}
                        loginPageUrl={this.loginPageUrl}
                        onToggleEditor={this.onToggleEditor}
                    />
                </div>
                <div className="Edit__content">
                    <div className={`Edit__preview-wrapper${this.props.editor.collapsed ? '_expanded' : ''}`}>
                        <Preview loginPageUrl={this.loginPageUrl} preview={this.props.preview} />
                    </div>

                    <div hidden={this.props.editor.collapsed} className="Edit__editor-wrapper">
                        <Editor editor={this.props.editor} preview={this.props.preview} />
                    </div>
                </div>
            </div>
        );
    }
}

Edit.propTypes = {
    editor: mobxPropTypes.observableObject.isRequired,
    preview: mobxPropTypes.observableObject.isRequired
};

export default observer(Edit);
