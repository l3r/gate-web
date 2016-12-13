/**
 * Created by Dominic Rout on 09/12/2016.
 */
"use strict";
var Annotation = (function () {
    function Annotation(type, set, startOffset, endOffset) {
        this._type = type;
        this._set = set;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
    }
    Object.defineProperty(Annotation.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Annotation.prototype, "set", {
        get: function () {
            return this._set;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Annotation.prototype, "startOffset", {
        get: function () {
            return this._startOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Annotation.prototype, "endOffset", {
        get: function () {
            return this._endOffset;
        },
        enumerable: true,
        configurable: true
    });
    return Annotation;
}());
exports.Annotation = Annotation;
