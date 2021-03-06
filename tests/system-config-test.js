SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': '../node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
        //scripts
        'app': '../js/app.js',
        'home': '../js/controllers/home.js',
        'browse': '../js/controllers/browse.js',
        'controllers': '../js/controllers/controllers.js',
        'templates': '../js/data/templates.js',
        'jquery-requester': '../js/data/jquery-requester.js',
        'requester': '../js/data/requester.js',
        'events': '../js/controllers/events.js',
        'register-controller': '../js/controllers/register.js',
        'restaurant-profile': '../js/controllers/restaurant-profile.js',
        'user-profile': '../js/controllers/user-profile.js'
    }
});