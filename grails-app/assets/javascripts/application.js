// This is a manifest file that'll be compiled into application.js.
//
// Any JavaScript file within this directory can be referenced here using a relative path.
//
// You're free to add application-wide JavaScript to this file, but it's generally better
// to create separate JavaScript files as needed.
//
//= require lib/require
//= require_self

requirejs.config({ //this initiates the configuration
    paths: {
        jquery: '/assets/lib/jquery-2.2.0.min',
        editing: '/assets/editing/bundle.js',
        underscore: '/assets/lib/underscore',
        bootstrap: '/assets/lib/bootstrap',
        "bootstrap-editable": '/assets/lib/bootstrap3-editable/bootstrap-editable'

    }
});


//
// if (typeof jQuery !== 'undefined') {
//     (function($) {
//         $(document).ajaxStart(function() {
//             $('#spinner').fadeIn();
//         }).ajaxStop(function() {
//             $('#spinner').fadeOut();
//         });
//     })(jQuery);
// }
//
// if (!Object.keys) {
//     Object.keys = function (obj) {
//         var keys = [],
//             k;
//         for (k in obj) {
//             if (Object.prototype.hasOwnProperty.call(obj, k)) {
//                 keys.push(k);
//             }
//         }
//         return keys;
//     };
// }