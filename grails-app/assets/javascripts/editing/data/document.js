///<reference path="../../lib/jquery.d.ts"/>
"use strict";
var endpoints_1 = require("../endpoints");
var annotationSets_1 = require("./annotationSets");
var colourField_1 = require("./colourField");
var colourFieldView_1 = require("../views/colourFieldView");
/**
 * Brings together all data for the document, including its text, annotation sets, and colour field.
 */
var Document = (function () {
    function Document(data) {
        // $(this).on("annotations:changed", () => $(this).triggerHandler("visibleAnnotations:changed"));
        this._id = data.id;
        this._text = data.text;
        this._name = data.name;
        this._annotationSets = annotationSets_1.AnnotationSets.fromJson(data.annotationSets);
        this._colourField = new colourField_1.ColourField(this._text.length, this._annotationSets);
    }
    // Goes to the required endpoint and fetches a document, returning it to callback.
    Document.fromId = function (id, callback) {
        var endpoints = endpoints_1.Endpoints.getInstance();
        $.getJSON(endpoints.getDocumentAnnotations, { "id": id }, function (data) {
            callback(new Document(data));
        });
    };
    Object.defineProperty(Document.prototype, "colourField", {
        get: function () {
            return this._colourField;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "annotationSets", {
        get: function () {
            return this._annotationSets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Document.prototype.getColourFieldView = function () {
        return new colourFieldView_1.ColourFieldView(this.text, this.colourField);
    };
    return Document;
}());
exports.Document = Document;
