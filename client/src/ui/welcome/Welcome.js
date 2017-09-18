import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@auth0/styleguide-react-components/lib/index";
import "./Welcome.css";

import welcomeImage from "./welcome-image.png";

const Welcome = () => (
    <div className="Welcome">
        <div className="Welcome__title-wrapper">
            <h1>Welcome to the Hosted Login Page Editor</h1>
            <h5>
                This tool will let you edit with just a few clicks the
                page that your users will see when you
                redirect them to Auth0 Hosted Login Page.
            </h5>

            <Link to="/edit">
                <Button bsStyle="success">Continue</Button>
            </Link>
        </div>

        <div className="Welcome__image-wrapper">
            <img src={welcomeImage} className="Welcome__image" alt="How this works"/>
        </div>
    </div>
);

export default Welcome;
