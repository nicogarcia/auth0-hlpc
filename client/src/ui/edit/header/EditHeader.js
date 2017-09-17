import React from "react";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import "./EditHeader.css";

const EditHeader = ({editorCollapsed, loginPageUrl, onToggleEditor}) => {
    return (
        <div className="EditHeader">
            <h4 className="EditHeader__title">
                Current Login Page Preview
            </h4>
            <div className="EditHeader__actions">
                <Button onClick={onToggleEditor}>
                    {editorCollapsed ? 'Edit' : 'Close editor'}
                </Button>
                <Button href={loginPageUrl} bsStyle="success" target="_blank">Open live version</Button>
            </div>
        </div>
    );
};

EditHeader.propTypes = {
    editorCollapsed: PropTypes.bool.isRequired,
    loginPageUrl: PropTypes.string.isRequired,
    onToggleEditor: PropTypes.func.isRequired
};

export default observer(EditHeader);
