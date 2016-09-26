"use strict";

import {Home} from "home";
import {users} from "users";
import {browse} from "browse";

class Controllers{
    constructor(home, browse){
        this.home = home;
        this.browse = browse;
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

const controllers = new Controllers(home, browse);

export { controllers} ;