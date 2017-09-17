import React from "react";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import CodeMirror from "react-codemirror";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

const EditorHtml = ({htmlValue, onChange, onSave, codeMirrorKey}) => (
    <div className="EditorHtml">
        <Button onClick={onSave}>Save</Button>

        <CodeMirror className="editor"
                    value={htmlValue}
                    onChange={onChange}
                    options={{
                        mode: 'htmlmixed',
                        lineNumbers: true
                    }}
                    key={codeMirrorKey}
        />
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
