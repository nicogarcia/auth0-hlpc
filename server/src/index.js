'use strict';

const request = require('request-promise');

module.exports = function (context, cb) {
    // TODO: Store in secrets
    const secrets = {
        client: {
            clientId: 'BgPq4dvkYKOw6M3aFXFvy0sIhPeVzs45',
            clientSecret: 'CI5vuR8OnrCuzbhLSF5JcUFbTYjCTWZQQZb_hWrqdSchxLx5jxo7OTMfWzI95waM'
        }
    };

    const config = {
        authEndpoint: 'https://test-xr4.auth0.com/oauth/token',
        audience: 'https://test-xr4.auth0.com/api/v2/'
    };

    const managementApi = new ManagementApiClient(request, config.audience);

    const getAccessTokenPromise = getOAuthToken(config, secrets)
        .then(response => {
            managementApi.setAccessToken(response.access_token);
        });

    if (context.body) {
        if (!context.body.hasOwnProperty('custom_login_page')) {
            return cb('custom_login_page field is required');
        }

        POST(cb, getAccessTokenPromise, managementApi, context.body.custom_login_page);
    } else {
        GET(cb, getAccessTokenPromise, managementApi);
    }
};

const getOAuthToken = (config, secrets) => {
    return request({
            method: 'POST',
            uri: config.authEndpoint,
            headers: {'content-type': 'application/json'},
            body: {
                grant_type: 'client_credentials',
                client_id: secrets.client.clientId,
                client_secret: secrets.client.clientSecret,
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

const POST = (cb, getAccessTokenPromise, managementApi, customLoginPageHtml) => {
    getAccessTokenPromise
        .then(() => managementApi.getGlobalClient())
        .then(globalClient => managementApi.setCustomLoginPage(globalClient.client_id, customLoginPageHtml))
        .then(response => cb(null, response))
        .catch(onUnhandledError(cb));
};

class ManagementApiClient {

    constructor(httpClient, apiUrl, accessToken) {
        this.httpClient = httpClient;
        this.apiUrl = apiUrl;
        this.accessToken = accessToken;
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
        console.log('-----------------', this, '----------------');
        return this.getGlobalClient().then(client => client.custom_login_page);
    }

    setCustomLoginPage(clientId, newCustomLoginPage) {
        return this.requestWithConfig({
            method: 'PATCH',
            uri: this.getEndpointUrl(`clients/${clientId}`),
            body: {
                custom_login_page: newCustomLoginPage
            }
        });
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
