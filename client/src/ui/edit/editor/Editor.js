import React, {Component} from "react";
import {Button, Col, Form, FormGroup, Select, Tab, Tabs} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../../api";
import {observer, PropTypes} from "mobx-react";
import {action} from "mobx";
import {TwitterPicker} from "react-color";
import "./Editor.css";
import EditorHtml from "./html/EditorHtml";
import {ControlLabel} from "react-bootstrap";
import update from "immutability-helper";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            htmlValue: '',
            selectedTab: 1,
            config: {theme: {}},
            settings: {
                primaryColor: {
                    pickerHidden: true
                }
            }
        };
    }

    componentDidMount() {
        const self = this;

        Api.getCustomLoginPage()
            .then(clientData => {
                self.setState(state => (
                    {htmlValue: clientData.custom_login_page, config: clientData.custom_config})
                );
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
        return Api.setCustomLoginPage(html, config)
            .then(action(() => {
                this.props.preview.iframe.src = this.props.preview.iframe.src;
            }));
    };

    handleChangeComplete = (color, setting) => {
        this.setState(update(this.state, {
            config: {theme: {primaryColor: {$set: color.hex}}},
            settings: {[setting]: {saved: {$set: 'Saving...'}}}
        }));

        this.saveHtml(this.state.htmlValue, this.state.config)
            .then(() => {
                this.setState(update(this.state, {
                    config: {theme: {primaryColor: {$set: color.hex}}},
                    settings: {[setting]: {saved: {$set: 'Saved!'}}}
                }));

                setTimeout(() => this.setState(update(this.state, {
                    settings: {[setting]: {saved: {$set: false}}}
                })), 1500);
            });
    };

    onHtmlSave = () => {
        this.saveHtml(this.state.htmlValue, this.state.config);
    };

    onHtmlCodeChange = (value) => {
        this.setState({htmlValue: value})
    };

    handleTogglePickerClick = (e, setting) => {
        const rect = e.target.getBoundingClientRect();

        this.setState(update(this.state, {
            settings: {
                [setting]: {
                    $merge: {
                        pickerHidden: update(this.state.settings[setting], {$apply: x => !x}),
                        position: {
                            x: window.innerWidth - rect.right,
                            y: rect.bottom
                        }
                    }
                }
            }
        }));
    };

    handleClosePickerClick = (setting) => {
        this.setState(update(this.state, {
            settings: {
                [setting]: {pickerHidden: {$set: true}}
            }
        }))
    };

    render() {
        return (
            <div className="Editor">
                <Tabs id="editor-tabs" activeKey={this.state.selectedTab} onSelect={this.handleTabSelect}>
                    <Tab className="Editor__tab" eventKey={1} title="Settings">
                        <Select
                            options={[
                                {label: 'Global settings', value: 'all'},
                                {label: 'Login', value: 'login'}
                            ]}
                            selected={0}
                            handleChange={() => {
                            }}
                            label="Select screen"
                        />
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} xs={7}>
                                    Primary color
                                    {
                                        this.state.settings.primaryColor &&
                                        this.state.settings.primaryColor.saved &&
                                        <div className="Editor__setting-saved_success">
                                            {this.state.settings.primaryColor.saved}
                                        </div>
                                    }
                                </Col>
                                <Col xs={5}>
                                    <Button className="Editor__color-picker"
                                            style={{'background': this.state.config.theme.primaryColor}}
                                            onClick={(e) => this.handleTogglePickerClick(e, 'primaryColor')}>
                                    </Button>
                                    {
                                        !this.state.settings.primaryColor.pickerHidden &&
                                        <div className="Editor__color-picker-cover"
                                             onClick={(e) => this.handleClosePickerClick('primaryColor')}>
                                            <div className="Editor__color-picker-popover"
                                                 style={{
                                                     right: this.state.settings.primaryColor.position.x,
                                                     top: this.state.settings.primaryColor.position.y
                                                 }}>
                                                <TwitterPicker color={this.state.config.theme.primaryColor}
                                                               triangle="top-right"
                                                               onChangeComplete={(color) => {
                                                                   this.handleChangeComplete(color, 'primaryColor')
                                                               }}/>
                                            </div>
                                        </div>
                                    }
                                </Col>
                            </FormGroup>
                        </Form>
                    </Tab>

                    <Tab className="Editor__tab" eventKey={2} title="Html">
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