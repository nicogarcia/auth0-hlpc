import React, {Component} from "react";
import "./PreviewHeader.css";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import * as config from "../../../config/index";

class PreviewHeader extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    render() {
        const {onToggleCollapseEditor} = this.props;

        return (
            <div>
                <h4 className="left">
                    Current Login Page
                </h4>
                <Button onClick={onToggleCollapseEditor}>Open Editor</Button>
                <Button href={this.loginPageUrl} target="_blank">Open live version</Button>
            </div>
        );
    }
}

export default PreviewHeader;
