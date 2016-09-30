"use strict";

let templates = (function() {
  let handlebars = window.handlebars || window.Handlebars,
    Handlebars = window.handlebars || window.Handlebars,
    cache = {};

  function get(name) {
   
    let promise = new Promise(function(resolve, reject) {
      if (cache[name]) {
        resolve(cache[name]);
        return;
      }
      let url = `../templates/${name}.handlebars`;
      $.get(url, function(html) {
        let template = handlebars.compile(html);
        cache[name] = template;
        resolve(template);
      });
    });
    return promise;
  }

  return {
    get: get
  };
}());

export { templates};