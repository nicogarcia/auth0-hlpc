import React, {Component} from "react";
import * as config from "../../config/index";
import PreviewHeader from "./header/PreviewHeader";
import {observer, PropTypes} from "mobx-react";

class Preview extends Component {
    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    onToggleEditor = () => {
        this.props.editor.collapsed = !this.props.editor.collapsed
    };

    render() {
        return (
            <div>
                <PreviewHeader editorCollapsed={this.props.editor.collapsed}
                               loginPageUrl={this.loginPageUrl}
                               onToggleEditor={this.onToggleEditor}
                />
                <iframe
                    id="custom-login-page-preview"
                    ref={iframe => {
                        this.props.preview.iframe = iframe;
                    }}
                    title="custom_login_page_preview"
                    src={this.loginPageUrl}>
                </iframe>
            </div>
        );
    }
}

Preview.propTypes = {
    editor: PropTypes.observableObject.isRequired,
    preview: PropTypes.observableObject.isRequired
};

export default observer(Preview);
