"use strict";

import {Home} from "home";
import {users} from "users";
import {browse} from "browse";
import {registerController} from "register-controller";
import {restaurantProfile} from "restaurant-profile";

class Controllers{
    constructor(home, browse, register, restaurantProfile){
        this.home = home;
        this.browse = browse;
        this.register = register;
        this.restaurantProfile = restaurantProfile;
    }
}

const home = new Home();

// let browse = (function getBrowsing(context) {
//     console.log("here");

//     templates.get("browse")
//         .then((template) => {
//             context.$element().html(template());
//         });

//     return {
//         all: getBrowsing
//     };   
// }());

const controllers = new Controllers(home, browse, registerController, restaurantProfile);

export { controllers} ;