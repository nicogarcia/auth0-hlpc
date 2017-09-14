'use strict';
const Express = require('express');
const Webtask = require('webtask-tools');
const bodyParser = require('body-parser');
const server = Express();
const request = require('request-promise');

server.use(bodyParser);

module.exports = Webtask.fromExpress(server);

// TODO: Store in secrets
const secrets = {
    clientId: 'BgPq4dvkYKOw6M3aFXFvy0sIhPeVzs45',
    clientSecret: 'CI5vuR8OnrCuzbhLSF5JcUFbTYjCTWZQQZb_hWrqdSchxLx5jxo7OTMfWzI95waM'
};

const config = {
    authEndpoint: 'https://test-xr4.auth0.com/oauth/token',
    audience: 'https://test-xr4.auth0.com/api/v2/',
    customConfigPlaceholder: '@@customConfig@@'
};

const managementApi = new ManagementApiClient(request, config.audience, null, config.customConfigPlaceholder);

server.use((req, res, next) => {
    getOAuthToken(config, secrets.clientId, secrets.clientSecret)
        .then(response => {
            managementApi.setAccessToken(response.access_token);
            next();
        })
        .catch((err) => {
            res.status(500).send({error: err});
        });
});

server.get('/', (req, res) => {

});

server.post('/', (req, res) => {

});

const getOAuthToken = (config, clientId, clientSecret) => {
    return request({
            method: 'POST',
            uri: config.authEndpoint,
            headers: {'content-type': 'application/json'},
            body: {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                audience: config.audience
            },
            json: true
        }
    );
};

const onUnhandledError = (cb) => {
    return err => {
        cb(err);
    };
};

const GET = (cb, getAccessTokenPromise, managementApi) => {
    getAccessTokenPromise
        .then(() => managementApi.getCustomLoginPage())
        .then(customLoginPage => {
            return cb(null, {custom_login_page: customLoginPage});
        })
        .catch(onUnhandledError(cb));
};

const POST = (cb, getAccessTokenPromise, managementApi, customLoginPageHtml, customConfig) => {
    getAccessTokenPromise
        .then(() => managementApi.getGlobalClient())
        .then(globalClient =>
            managementApi.setCustomLoginPage(globalClient.client_id, customLoginPageHtml, customConfig)
        )
        .then(response => cb(null, response))
        .catch(onUnhandledError(cb));
};

class ManagementApiClient {

    constructor(httpClient, apiUrl, accessToken, customConfigPlaceholder) {
        this.httpClient = httpClient;
        this.apiUrl = apiUrl;
        this.accessToken = accessToken;
        this.customConfigPlaceholder = customConfigPlaceholder;
    }

    defaultConfigBuilder() {
        return {
            json: true,
            headers: {'Authorization': 'Bearer ' + this.accessToken}
        };
    }

    getGlobalClient() {
        return this.requestWithConfig({uri: this.getEndpointUrl('clients')})
            .then(this.findGlobalClient);
    }

    getCustomLoginPage() {
        return this.getGlobalClient().then(client => client.custom_login_page);
    }

    setCustomLoginPage(clientId, newCustomLoginPage) {
        return this
            .requestWithConfig({
                method: 'PATCH',
                uri: this.getEndpointUrl(`clients/${clientId}`),
                body: {
                    custom_login_page: newCustomLoginPage
                }
            })
            .then(() => newCustomLoginPage);
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    mergeCustomLoginPageWithConfig(customLoginPage, customConfig) {
        const regex = new RegExp(this.customConfigPlaceholder);

        const stringifiedConfig = JSON.stringify(customConfig);

        const serializedCustomConfig = Buffer.from(encodeURIComponent(stringifiedConfig)).toString('base64');

        return customLoginPage.replace(regex, serializedCustomConfig);
    }

    findGlobalClient(clients) {
        return clients.find(x => x.global === true);
    }

    getEndpointUrl(endpoint) {
        return this.apiUrl + endpoint;
    }

    requestWithConfig(customConfig) {
        return this.httpClient(this.getDefaultConfig(customConfig));
    }

    getDefaultConfig(customConfig) {
        return Object.assign({}, this.defaultConfigBuilder(), customConfig);
    }

}
