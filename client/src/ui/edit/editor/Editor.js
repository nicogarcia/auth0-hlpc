import React, {Component} from "react";
import {Select, Tab, Tabs} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../../api";
import {observer, PropTypes} from "mobx-react";
import {action} from "mobx";
import {TwitterPicker} from "react-color";
import "./Editor.css";
import EditorHtml from "./html/EditorHtml";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {htmlValue: '', selectedTab: 1, config: {theme: {}}};
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

    saveHtml = (html, config) => {
        Api.setCustomLoginPage(html, config)
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
                },
                ...this.state.config
            }
        });
        this.saveHtml(this.state.htmlValue, this.state.config);
    };

    onHtmlSave = () => {
        this.saveHtml(this.state.htmlValue, this.state.config);
    };

    onHtmlCodeChange = (value) => {
        this.setState({htmlValue: value})
    };

    render() {
        return (
            <div className="Editor">
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
                        <EditorHtml htmlValue={this.state.htmlValue}
                                    onChange={this.onHtmlCodeChange}
                                    onSave={this.onHtmlSave}
                                    codeMirrorKey={this.props.editor.htmlEditor.key}
                        />
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