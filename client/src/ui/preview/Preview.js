import React from "react";
import {observer, PropTypes as mboxPropTypes} from "mobx-react";
import {action} from "mobx";
import PropTypes from "prop-types";

const Preview = ({loginPageUrl, preview}) => (
    <div>
        <iframe
            id="custom-login-page-preview"
            ref={iframe => {
                preview.iframe = iframe;
            }}
            title="custom_login_page_preview"
            src={loginPageUrl}>
        </iframe>
    </div>
);

Preview.propTypes = {
    loginPageUrl: PropTypes.string.isRequired,
    preview: mboxPropTypes.observableObject.isRequired
};

export default observer(Preview);
