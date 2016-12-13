/*
//	Encodes the colour values at each position of the document text.
*/
"use strict";
var colour_1 = require("./colour");
var ColourField = (function () {
    function ColourField(length, annotationSets) {
        this.annotationSets = annotationSets;
        this.colourField = new Array(length);
        this.colourField.fill(new colour_1.Colour(255, 255, 255, 0));
        this.annotationsAt = new Array(length);
        this.annotationsAt.fill([]);
    }
    ColourField.prototype.update = function () {
        var _this = this;
        var visible = this.annotationSets.getVisibleAnnotations();
        // First, reset the colour field and annotations lists.
        this.colourField.fill(new colour_1.Colour(255, 255, 255, 0));
        this.annotationsAt.fill([]);
        // Fill in the colour for each individual annotation.
        visible.forEach(function (annotation) {
            for (var i = annotation.startOffset; i < annotation.endOffset; i++) {
                var annotationColour = _this.annotationSets.typeColour(annotation.set, annotation.type);
                _this.colourField[i] = _this.colourField[i].combineAlpha(annotationColour);
                _this.annotationsAt[i].push(annotation);
            }
        });
    };
    ColourField.prototype.get = function (offset) {
        return this.colourField[offset];
    };
    ColourField.prototype.getAnnotations = function (offset) {
        return this.annotationsAt[offset];
    };
    return ColourField;
}());
exports.ColourField = ColourField;
