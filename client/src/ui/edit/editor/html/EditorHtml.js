import React from "react";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import CodeMirror from "react-codemirror";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import "./EditorHtml.css";

const EditorHtml = ({htmlValue, onChange, onSave, codeMirrorKey}) => (
    <div className="EditorHtml">
        <div className="EditorHtml__actions">
            <Button bsStyle="primary" onClick={onSave}>Save</Button>
        </div>

        <div className="EditorHtml__editor-container">
            <CodeMirror className="EditorHtml__editor"
                        value={htmlValue}
                        onChange={onChange}
                        options={{
                            mode: 'htmlmixed',
                            lineNumbers: true,
                            //viewportMargin: Infinity,
                            fullScreen: false
                        }}
                        key={codeMirrorKey}
            />
        </div>
    </div>
);

EditorHtml.propTypes = {
    htmlValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    /* Hack to allow code editor refresh */
    codeMirrorKey: PropTypes.number.isRequired
};

export default observer(EditorHtml);
