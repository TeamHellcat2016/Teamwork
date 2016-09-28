import {jqueryRequester} from "jquery-requester";

var requester = (function () {
    const CURRENT_USER_ID = "current-user-id";
    const AUTH_TOKEN = "auth-token";
    const CURRENT_USER_NAME = "username";
    const appId = "kid_rJWkfzw6";
    const appSecret = "9861c3e41b4a41e4976d17e5c48f8e26";
    const masterSecret = "039e3c57e4474187aa9c5b6d540c13e1";
    var authorizationString = `${appId}:${appSecret}`;
    authorizationString = btoa(authorizationString);


    const url = "https://baas.kinvey.com";
    const getUrl = url + appId;
    const userUrl = url + `/user/${appId}/`;
    const loginUserUrl = userUrl + "login";
    const logoutUserUrl = userUrl + "_logout";
    const getRestaurantsUrl = url + `/appdata/${appId}/restaurants`;

    function registerUserRequest(username, password) {
        const data = { username, password };
        const headers = { Authorization: `Basic ${authorizationString}` };
        return jqueryRequester.post(userUrl, headers, data);
    }

    function loginUserRequest(username, password) {
        const data = { username, password };
        const headers = { Authorization: `Basic ${authorizationString}` };
        return jqueryRequester.post(loginUserUrl, headers, data)
            .then((res) => {
                localStorage.setItem(CURRENT_USER_ID, res._id);
                localStorage.setItem(AUTH_TOKEN, res._kmd.authtoken);
                localStorage.setItem(CURRENT_USER_NAME, res.username);
            });
    }

    function logoutUserRequest(username, password) {
        const data = { username, password };
        var authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        return jqueryRequester.post(logoutUserUrl, headers, data)
            .then(() => {
                localStorage.removeItem(CURRENT_USER_ID);
                localStorage.removeItem(CURRENT_USER_NAME);
                localStorage.removeItem(AUTH_TOKEN);
            });
    }

    function isLoggedIn(){
        return new Promise((resolve, reject) => {
            const username = localStorage.getItem(CURRENT_USER_NAME);
            if(username){
                resolve(username);
            }
            reject();
        });
    }

    function getAllRestaurants() {
        var authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        return jqueryRequester.get(getRestaurantsUrl, headers);
    }
    
    return {
        registerUser: registerUserRequest,
        loginUser: loginUserRequest,
        logoutUser: logoutUserRequest,
        isLoggedIn: isLoggedIn,
        getAllRestaurants: getAllRestaurants
    };
} ());

export {requester};