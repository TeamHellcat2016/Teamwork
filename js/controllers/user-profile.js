import {templates} from "templates";
import {requester} from "requester";

let userProfile = (function () {

    function getProfile(context) {
        let userInfo;

        //TODO: fix promise structure
        requester.getUserInfo()
            .then((user) => {
                userInfo = user;
                return templates.get("user-profile");
            })
            .then((templateFunc) => {
                context.$element().html(templateFunc(userInfo));
            })
            .then(() => {
                let allRestaurants = [];
                let length = userInfo.favourites.length;
                let itemsProcessed = 0;
                return new Promise((resolve, reject) => {
                    if(userInfo.favourites.length===0){
                        resolve(allRestaurants);
                        return;
                    }
                    userInfo.favourites.forEach((id) => {
                        requester.getRestaurantById(id)
                            .then((restaurant) => {
                                allRestaurants.push(restaurant);
                                itemsProcessed++;
                                if (itemsProcessed === length) {
                                    resolve(allRestaurants);
                                }
                            });
                    });
                });

            })
            .then((allRestaurants) => {
                templates.get("restaurants-list")
                    .then((listTemplateFunc) => {
                        $("#restaurants-list").html(listTemplateFunc({ data: allRestaurants }));

                        $(".add-to-favourites").addClass("hidden");
                    })
                    .then(()=>{

                    })
            });
    }

    return {
        all: getProfile
    };
} ());

export {userProfile};