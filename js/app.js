import {controllers} from "controllers";
import {attachEvents} from "events";

(function () {

    var sammyApp = Sammy("#content", function () {
        this.get('#/', function (context) {
            context.redirect('#/home');
        });

        this.get('#/home', controllers.home.all);

        this.get("#/browse", controllers.browse.all);

        this.get("#/register", controllers.register.all);
    });


    sammyApp.run('#/');

    attachEvents();
} ());