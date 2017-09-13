import React, {Component} from "react";
import * as config from "../../config/index";
import PreviewHeader from "./header/PreviewHeader";

class Preview extends Component {
    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
        this.state = {};
    }

    render() {
        const {onToggleCollapseEditor} = this.props;

        return (
            <div>
                <PreviewHeader onToggleCollapseEditor={onToggleCollapseEditor}/>
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

export default Preview;
