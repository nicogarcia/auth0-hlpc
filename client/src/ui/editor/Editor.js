import React, {Component} from "react";
import CodeMirror from "react-codemirror";
import {Button, Tab, Tabs} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../api";
import {observer, PropTypes} from "mobx-react";
import {action} from "mobx";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {htmlValue: null, selectedTab: 1};
    }

    componentDidMount() {
        const self = this;

        Api.getCustomLoginPage()
            .then(customLoginPage => {
                self.setState(state => ({htmlValue: customLoginPage}));
                self.refreshHtmlEditor();
            });
    }

    refreshHtmlEditor = action(() => {
        // Hack to make editor update its content
        // https://github.com/JedWatson/react-codemirror/issues/106#issuecomment-318781325
        this.props.editor.htmlEditor.key += 1;
    });

    handleSelect = (key) => {
        this.setState({selectedTab: key});

        // TODO: Ugly hack, please review
        setTimeout(this.refreshHtmlEditor, 500);
        //this.refreshHtmlEditor();
    };

    onClick = () => {
        Api.setCustomLoginPage(this.state.htmlValue)
            .then(console.log)
            .then(action(() => {
                this.props.preview.iframe.src = this.props.preview.iframe.src;
            }));
    };

    render() {
        return (
            <div>
                <h4>Editor</h4>
                <Tabs activeKey={this.state.selectedTab} onSelect={this.handleSelect} id="editor-tabs">
                    <Tab eventKey={1} title="Options">
                        Options content
                    </Tab>
                    <Tab eventKey={2} title="Html">
                        <CodeMirror className="editor"
                                    value={this.state.htmlValue}
                                    onChange={(value) => this.setState({htmlValue: value})}
                                    options={{
                                        mode: 'htmlmixed',
                                        lineNumbers: true
                                    }}
                                    key={this.props.editor.htmlEditor.key}
                        />
                        <Button onClick={this.onClick}>Save</Button>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

Editor.propTypes = {
    preview: PropTypes.observableObject.isRequired,
    editor: PropTypes.observableObject.isRequired
};

export default observer(Editor);