"use strict";
/**
 * This should be initialised by setting the endpoints using Grails' URL generation.
 *
 * Created by Dominic Rout on 09/12/2016.
 */
var Targets = (function () {
    function Targets() {
    }
    Targets.getInstance = function () {
        return Targets._instance;
    };
    Targets._instance = new Targets();
    return Targets;
}());
exports.Targets = Targets;
