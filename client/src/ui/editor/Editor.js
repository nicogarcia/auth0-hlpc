import React, {Component} from "react";
import CodeMirror from "react-codemirror";
import {Button, Select, Tab, Tabs} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../api";
import {observer, PropTypes} from "mobx-react";
import {action} from "mobx";
import {TwitterPicker} from "react-color";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {htmlValue: null, selectedTab: 1, config: {theme: {}}};
    }

    componentDidMount() {
        const self = this;

        Api.getCustomLoginPage()
            .then(clientData => {
                self.setState(state => ({htmlValue: clientData.custom_login_page, config: clientData.custom_config}));
                self.refreshHtmlEditor();
            });
    }

    refreshHtmlEditor = action(() => {
        // Hack to make editor update its content
        // https://github.com/JedWatson/react-codemirror/issues/106#issuecomment-318781325
        this.props.editor.htmlEditor.key += 1;
    });

    handleTabSelect = (key) => {
        this.setState({selectedTab: key});

        // TODO: Ugly hack, please review
        setTimeout(this.refreshHtmlEditor, 500);
        //this.refreshHtmlEditor();
    };

    onClick = () => {
        Api.setCustomLoginPage(this.state.htmlValue, this.state.config)
            .then(action(() => {
                this.props.preview.iframe.src = this.props.preview.iframe.src;
            }));
    };

    handleChangeComplete = (color) => {
        this.setState({
            config: {
                theme: {
                    ...this.state.config.theme,
                    primaryColor: color.hex
                }
            },
            ...this.state.config
        });
        this.onClick();
    };

    render() {
        return (
            <div>
                <h4>Editor</h4>
                <Tabs activeKey={this.state.selectedTab} onSelect={this.handleTabSelect} id="editor-tabs">
                    <Tab eventKey={1} title="Options">
                        <Select
                            options={[
                                {label: 'All', value: 'all'},
                                {label: 'Login', value: 'login'}
                            ]}
                            selected={0}
                            handleChange={() => {
                            }}
                            label="Select screen"
                        />
                        <TwitterPicker color={this.state.config.theme.color}
                                       triangle="hide"
                                       onChangeComplete={this.handleChangeComplete}/>
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