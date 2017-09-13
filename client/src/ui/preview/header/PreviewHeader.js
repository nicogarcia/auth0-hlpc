import React, {Component} from "react";
import "./PreviewHeader.css";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import * as config from "../../../config/index";
import {observer} from "mobx-react";

class PreviewHeader extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;
    }

    onToggleEditor = () => {
        this.props.editor.collapsed = !this.props.editor.collapsed;
    };

    render() {
        return (
            <div>
                <h4 className="left">
                    Current Login Page
                </h4>
                <Button onClick={this.onToggleEditor}>
                    {this.props.editor.collapsed ? 'Open Editor' : 'Close editor'}
                </Button>
                <Button href={this.loginPageUrl} target="_blank">Open live version</Button>
            </div>
        );
    }
}

export default observer(PreviewHeader);
