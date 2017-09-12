import React, {Component} from "react";
import CodeMirror from "react-codemirror";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import Api from "../../api";

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {htmlValue: null, key: 0};
    }

    componentDidMount() {
        const self = this;

        Api.getCustomLoginPage()
            .then(customLoginPage => {
                self.setState(state => ({htmlValue: customLoginPage, key: state.key + 1}));
            });
    }

    onClick = () => {
        Api.setCustomLoginPage(this.state.htmlValue)
            .then(console.log)
            .then(() => {
                this.iframe.src = this.iframe.src;
            });
    };

    render() {
        return (
            <div>
                <CodeMirror className="editor"
                            value={this.state.htmlValue}
                            onChange={(value) => this.setState({htmlValue: value})}
                            options={{
                                mode: 'htmlmixed',
                                lineNumbers: true
                            }}
                            key={this.state.key}
                />
                <Button onClick={this.onClick}>Save</Button>
            </div>
        );
    }
}

export default Editor;