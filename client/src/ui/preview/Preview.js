import React, {Component} from "react";
import * as config from "../../config/index";
import PreviewHeader from "./header/PreviewHeader";
import {observer, PropTypes} from "mobx-react";

class Preview extends Component {
    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    render() {
        return (
            <div>
                <PreviewHeader editor={this.props.editor}/>
                <iframe
                    id="custom-login-page-preview"
                    ref={iframe => {
                        this.iframe = iframe;
                    }}
                    title="custom_login_page_preview"
                    src={this.loginPageUrl}>
                </iframe>
            </div>
        );
    }
}

Preview.propTypes = {
    editor: PropTypes.observableObject
};

export default observer(Preview);
