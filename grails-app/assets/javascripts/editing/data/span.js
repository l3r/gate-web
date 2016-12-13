"use strict";
/**
 * Contains enough data to construct a span over a section of text in the field viewer.
 *
 * Created by Dominic Rout on 09/12/2016.
 */
var Span = (function () {
    function Span(start, end, colour, annotations) {
        this._start = start;
        this._end = end;
        this._colour = colour;
        this._annotations = annotations;
    }
    Object.defineProperty(Span.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "colour", {
        get: function () {
            return this._colour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "annotations", {
        get: function () {
            return this._annotations;
        },
        enumerable: true,
        configurable: true
    });
    return Span;
}());
exports.Span = Span;
