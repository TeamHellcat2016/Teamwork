import {templates} from "templates";
import {requester} from "requester";

let browse = (function () {

    function getBrowsing(context) {
        var data;
        requester.getAllRestaurants()
            .then((result) => {
                data = result;
                return templates.get("browse");
            })
            .then((templateFunc) => {
                context.$element().html(templateFunc({ data }));
            });
    }
    return {
        all: getBrowsing
    };
} ());

export {browse};