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
                        let parent;
                        let description;
                        $(".list-unstyled").on("click", ".btn-info", function (ev) {
                            parent = $(ev.target).parents('.restaurant');
                            if(parent.children().children('.desc').children().length == 0){
                                let id = parent.attr("data-id");
                                requester.getRestaurantById(id)
                                    .then((res)=>{
                                        description = res.description;
                                        return templates.get('description');
                                    })
                                    .then((templateFunc)=>{
                                        parent.children().children('.desc').append(templateFunc(description));
                                    })
                            } else {
                                parent.children().children('.desc').children().remove('#restaurant-description');
                            }
                            ev.preventDefault();
                            return false;
                        });

                        let comment;
                        let parentComment;
                        $(".list-unstyled").on("click", ".btn-comments", function (ev){
                            parentComment = $(ev.target).parents('.restaurant');

                            if(parentComment.children().children('.comments').children().length == 0){
                                var id = parentComment.attr('data-id');
                                requester.getRestaurantById(id)
                                    .then((res)=>{
                                        comment = res.comments;
                                        return templates.get('comment');
                                    })
                                    .then((templateFunc)=>{
                                        parentComment.children().children('.comments').append(templateFunc(comment));
                                    })
                            } else {
                                parentComment.children().children('.comments').children().remove('.restaurant-comment');
                            }
                            ev.preventDefault();
                            return false;
                        });
                    })
            });
    }

    return {
        all: getProfile
    };
} ());

export {userProfile};