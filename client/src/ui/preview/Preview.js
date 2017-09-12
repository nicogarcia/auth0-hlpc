import React, {Component} from "react";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import * as config from "../../config/index";
import PreviewHeader from "./header/PreviewHeader";

class Preview extends Component {
    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
        this.state = {};
    }

    render() {
        return (
            <div>
                <PreviewHeader/>
                <Button href={this.loginPageUrl} target="_blank">Open live version</Button>
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
