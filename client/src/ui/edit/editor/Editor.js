import React, {Component} from "react";
import {Button, Col, Form, FormGroup, Select, Tab, Tabs} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../../api";
import {observer, PropTypes} from "mobx-react";
import {action} from "mobx";
import {TwitterPicker} from "react-color";
import "./Editor.css";
import EditorHtml from "./html/EditorHtml";
import {ControlLabel} from "react-bootstrap";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {htmlValue: '', selectedTab: 1, config: {theme: {}}, hidden: true, position: {x: 0, y: 0}};
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
                ...this.state.config,
                theme: {
                    ...this.state.config.theme,
                    primaryColor: color.hex
                }
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
                <Tabs id="editor-tabs" activeKey={this.state.selectedTab} onSelect={this.handleTabSelect}>
                    <Tab className="Editor__tab" eventKey={1} title="Options">
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
                                </Col>
                                <Col xs={5}>
                                    <Button className="Editor__color-picker"
                                            style={{'background': this.state.config.theme.primaryColor}}
                                            onClick={(e) => {
                                                const rect = e.target.getBoundingClientRect();

                                                this.setState({
                                                    hidden: !this.state.hidden,
                                                    position: {x: window.innerWidth - rect.right, y: rect.bottom}
                                                })
                                            }}
                                    >
                                    </Button>
                                    {
                                        !this.state.hidden &&
                                        <div className="Editor__color-picker-cover"
                                             onClick={() => this.setState({hidden: true})}>
                                            <div className="Editor__color-picker-popover"
                                                 style={{right: this.state.position.x, top: this.state.position.y}}>
                                                <TwitterPicker color={this.state.config.theme.primaryColor}
                                                               triangle="top-right"
                                                               onChangeComplete={this.handleChangeComplete}/>
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