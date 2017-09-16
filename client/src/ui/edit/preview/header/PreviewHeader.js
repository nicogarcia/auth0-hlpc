import React from "react";
import {Button, Col} from "@auth0/styleguide-react-components/lib/index";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

const PreviewHeader = ({editorCollapsed, loginPageUrl, onToggleEditor}) => {
    return (
        <div>
            <h4 className="pull-left">
                Current Login Page
            </h4>
            <div className="pull-right">
                <Button onClick={onToggleEditor}>
                    {editorCollapsed ? 'Edit' : 'Close editor'}
                </Button>
                <Button href={loginPageUrl} bsStyle="success" target="_blank">Open live version</Button>
            </div>
        </div>
    );
};

PreviewHeader.propTypes = {
    editorCollapsed: PropTypes.bool.isRequired,
    loginPageUrl: PropTypes.string.isRequired,
    onToggleEditor: PropTypes.func.isRequired
};

export default observer(PreviewHeader);
