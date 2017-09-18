import React, {Component} from "react";
import Editor from "./editor/Editor";
import Preview from "./preview/Preview";
import EditHeader from "./header/EditHeader";
import {observer, PropTypes as mobxPropTypes} from "mobx-react";
import {action} from "mobx";
import config from "../../config";
import "./Edit.css";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";

class Edit extends Component {

    constructor(props) {
        super(props);

        this.loginPageUrl = config.loginPageUrl;

        const query = qs.parse(props.location.search);
        this.props.editor.collapsed = !query.tab;
    }

    onToggleEditor = action(() => {
        this.props.editor.collapsed = !this.props.editor.collapsed;

        const history = this.props.history;
        let location = {...history.location};

        if (this.props.editor.collapsed) {
            history.push(location);
        } else {
            location = {...location, query: {...location.query, tab: 1}};
            history.push(location);
        }

        // Hack to make editor update its content
        // https://github.com/JedWatson/react-codemirror/issues/106#issuecomment-318781325
        this.props.editor.htmlEditor.key += 1;
    });

    render() {
        return (
            <div className="Edit">
                <div className="Edit__header">
                    <EditHeader editorCollapsed={this.props.editor.collapsed}
                                loginPageUrl={this.loginPageUrl}
                                onToggleEditor={this.onToggleEditor}
                    />
                </div>
                <div className="Edit__content">
                    <div className="Edit__preview-wrapper">
                        <Preview loginPageUrl={this.loginPageUrl} preview={this.props.preview}/>
                    </div>

                    <div hidden={this.props.editor.collapsed} className="Edit__editor-wrapper">
                        <Editor editor={this.props.editor} preview={this.props.preview}/>
                    </div>
                </div>
            </div>
        );
    }
}

Edit.propTypes = {
    editor: mobxPropTypes.observableObject.isRequired,
    preview: mobxPropTypes.observableObject.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(observer(Edit));
