import React, {Component} from "react";
import './PreviewHeader.css';
import {Button} from "@auth0/styleguide-react-components/lib/index";

class PreviewHeader extends Component {
    render() {
        return (
            <div>
                <Button href={this.loginPageUrl} target="_blank">Open live version</Button>
            </div>
        );
    }
}

export default PreviewHeader;
