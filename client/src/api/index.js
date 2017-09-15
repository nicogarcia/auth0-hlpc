import config from "../config";

class Api {

    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    getCustomLoginPage() {
        return this.fetchEndpoint('')
            .then(res => res.json());
    }

    setCustomLoginPage(customLoginPage, customConfig) {
        return this.fetchEndpoint('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({custom_login_page: customLoginPage, custom_config: customConfig})
        });
    }

    fetchEndpoint(endpoint, options) {
        return fetch(this.apiUrl + endpoint, options);
    }
}

export default new Api(config.apiUrl);