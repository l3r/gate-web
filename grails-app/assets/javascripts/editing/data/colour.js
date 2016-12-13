"use strict";
/**
 * Represents an RGBA colour with methods for mixing and comparison
 *
 * Created by Dominic Rout on 09/12/2016.
 */
var Colour = (function () {
    function Colour(r, g, b, a) {
        this._r = Math.floor(r);
        this._g = Math.floor(g);
        this._b = Math.floor(b);
        this._a = a;
    }
    Colour.prototype.withAlpha = function (a) {
        return new Colour(this._r, this._g, this._b, a);
    };
    Object.defineProperty(Colour.prototype, "r", {
        get: function () {
            return this._r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colour.prototype, "g", {
        get: function () {
            return this._g;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colour.prototype, "b", {
        get: function () {
            return this._b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colour.prototype, "a", {
        get: function () {
            return this._a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colour.prototype, "rgbString", {
        get: function () {
            return "rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})";
        },
        enumerable: true,
        configurable: true
    });
    Colour.prototype.combineAlpha = function (other) {
        /* Combines two colours, appying alpha channel*/
        var r, g, b, alpha;
        alpha = this.a + other.a * (1 - this.a);
        r = Math.floor((other.r * this.a + other.r * other.a * (1 - this.a)) / alpha);
        g = Math.floor((other.g * this.a + other.g * other.a * (1 - this.a)) / alpha);
        b = Math.floor((other.b * this.a + other.b * other.a * (1 - this.a)) / alpha);
        return new Colour(r, g, b, alpha);
    };
    Colour.prototype.equals = function (other) {
        return this.r == other.r &&
            this.g == other.g &&
            this.b == other.b &&
            this.a == other.a;
    };
    return Colour;
}());
exports.Colour = Colour;
