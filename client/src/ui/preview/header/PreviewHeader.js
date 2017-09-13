import React from "react";
import "./PreviewHeader.css";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

const PreviewHeader = ({editorCollapsed, loginPageUrl, onToggleEditor}) => {
    return (
        <div>
            <h4 className="left">
                Current Login Page
            </h4>
            <Button onClick={onToggleEditor}>
                {editorCollapsed ? 'Open Editor' : 'Close editor'}
            </Button>
            <Button href={loginPageUrl} target="_blank">Open live version</Button>
        </div>
    );
};

PreviewHeader.propTypes = {
    editorCollapsed: PropTypes.bool.isRequired,
    loginPageUrl: PropTypes.string.isRequired,
    onToggleEditor: PropTypes.func.isRequired
};

export default observer(PreviewHeader);
