import React from "react";
import { observer, PropTypes as mboxPropTypes } from "mobx-react";
import { action } from "mobx";
import PropTypes from "prop-types";
import './Preview.css';

const Preview = ({ loginPageUrl, preview }) => (
    <iframe
        id="custom-login-page-preview"
        ref={iframe => {
            preview.iframe = iframe;
        }}
        title="custom_login_page_preview"
        src={loginPageUrl}>
    </iframe>
);

Preview.propTypes = {
    loginPageUrl: PropTypes.string.isRequired,
    preview: mboxPropTypes.observableObject.isRequired
};

export default observer(Preview);
