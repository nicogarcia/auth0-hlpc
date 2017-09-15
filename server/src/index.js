'use strict';
const Promise = require('bluebird');
const Express = require('express');
const Webtask = require('webtask-tools');
const bodyParser = require('body-parser');
const server = Express();
const request = require('request-promise');

let defaultData = {
    customLoginPage: require('./login_template'),
    customConfig: {
        theme: {}
    }
};

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

server.use(bodyParser.json());

server.use((req, res, next) => {
    req.managementApi = new ManagementApiClient(request, config.audience, null, config.customConfigPlaceholder);

    getOAuthToken(config, secrets.clientId, secrets.clientSecret)
        .then(response => {
            req.managementApi.setAccessToken(response.access_token);
            next();
        })
        .catch(onUnhandledError(res));
});

server.get('/', (req, res) => {
    getClientData(req.webtaskContext.storage, secrets.clientId)
        .then(clientData => {
            return res.json(clientData);
        })
        .catch(onUnhandledError(res));
});

server.post('/', (req, res) => {
    if (!validateClientData(req.body)) {
        res.status(400).json({error: 'custom_login_page and custom_config fields are required'});
    }

    const clientData = {customLoginPage: req.body.custom_login_page, customConfig: req.body.custom_config};

    const newCustomLoginPage = mergeCustomLoginPageWithConfig(clientData.customLoginPage, clientData.customConfig);

    req.managementApi.getGlobalClient()
        .then(globalClient => req.managementApi.setCustomLoginPage(globalClient.client_id, newCustomLoginPage))
        .then(() => setClientData(req.webtaskContext.storage, secrets.clientId, clientData))
        .then(() => res.sendStatus(200))
        .catch(onUnhandledError(res));
});

const validateClientData = (data) => {
    return data.hasOwnProperty('custom_login_page') && data.hasOwnProperty('custom_config');
};

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

const onUnhandledError = (res) => {
    return err => {
        res.status(500).json({error: err});
    };
};

const initialStore = () => ({clients: {}});

const getClientData = (storage, clientId) => {
    return getStore(storage)
        .then(store => {
            return store.clients[clientId] || defaultData;
        });
};

const getStore = (storage) => {
    return Promise.promisify(storage.get)()
        .then(store => typeof store === 'undefined' ? initialStore() : store);
};


const setClientData = (storage, clientId, data) => {
    return getStore(storage)
        .then(store => {
            store.clients[clientId] = data;
            return setStore(store, storage);
        });
};

const setStore = (store, storage) => {
    return Promise.promisify(storage.set)(store);
};

const mergeCustomLoginPageWithConfig = (customLoginPage, customConfig) => {
    const regex = new RegExp(config.customConfigPlaceholder);

    const stringifiedConfig = JSON.stringify(customConfig);

    const serializedCustomConfig = Buffer.from(encodeURIComponent(stringifiedConfig)).toString('base64');

    return customLoginPage.replace(regex, serializedCustomConfig);
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
