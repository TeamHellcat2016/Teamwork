"use strict";

import {home} from "home";
import {browse} from "browse";
import {registerController} from "register-controller";
import {restaurantProfile} from "restaurant-profile";
import {userProfile} from "user-profile";

let controllers = (function () {
    return {
        home: home,
        browse: browse,
        register: registerController,
        restaurantProfile: restaurantProfile,
        userProfile: userProfile
    };
} ());

export { controllers};