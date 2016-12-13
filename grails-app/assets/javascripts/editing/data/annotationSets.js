///<reference path="../../lib/core-js.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
"use strict";
var annotation_1 = require("./annotation");
var colours;
colours = [[31, 119, 180], [174, 199, 232], [255, 127, 14], [255, 187, 120], [44, 160, 44], [152, 223, 138],
    [214, 39, 40], [255, 152, 150], [148, 103, 189], [197, 176, 213], [140, 86, 75], [196, 156, 148],
    [227, 119, 194], [247, 182, 210], [127, 127, 127], [199, 199, 199], [188, 189, 34],
    [219, 219, 141], [23, 190, 207], [158, 218, 229]];
/**
 * Stores the map of annotation sets onto types plus their colours.
 */
var AnnotationSets = (function () {
    function AnnotationSets() {
        this.lastColourUsed = 0;
        this.typeColours = new Map();
        this.annotations = new Map();
        this.isVisible = new Map();
    }
    /**
     * Reads the collection of annotations from a JSON data structure.
     * @param json
     */
    AnnotationSets.fromJson = function (json) {
        var result = new AnnotationSets();
        for (var annotationSet in json) {
            for (var annotationType in json[annotationSet]) {
                for (var _i = 0, _a = json[annotationSet][annotationType]; _i < _a.length; _i++) {
                    var annotation = _a[_i];
                    result.addAnnotation(
                        new Annotation(
                            annotationSet,
                            annotationType,
                            annotation.startOffset,
                            annotation.endOffset,
                            annotation.id));
                }
            }
        }
        return result;
    };
    /**
     * Generates a colour for the given type, or retrieves it if there already is one.
     * @param annotationSet Annotation Sert of interest.
     * @param type Annotation Type of interest
     * @param alpha
     * @returns {string|T[]|any|number[]}
     */
    AnnotationSets.prototype.typeColour = function (annotationSet, type, alpha) {
        if (alpha === void 0) { alpha = 0.3; }
        var colour;
        if (this.typeColours.has(annotationSet) &&
            this.typeColours.get(annotationSet).has(type)) {
            return this.typeColours.get(annotationSet).get(type).withAlpha(alpha);
        }
        else {
            // Get the next colour to use.
            colour = colours[this.lastColourUsed];
            this.lastColourUsed += 1;
            if (this.lastColourUsed === colours.length) {
                this.lastColourUsed = 0;
            }
            if (!this.typeColours.has(annotationSet)) {
                this.typeColours.set(annotationSet, new Map());
            }
            this.typeColours.get(annotationSet).set(type, colour);
            return colour;
        }
    };
    AnnotationSets.prototype.isAnnotationVisible = function (annotationSet, annotationType) {
        return this.isVisible.has(annotationSet)
            && this.isVisible.get(annotationSet).has(annotationType)
            && this.isVisible.get(annotationSet).get(annotationType) == true;
    };
    /**
     * Produces a flat list of annotations that should be displayed in the document.
     * @returns {any}
     */
    AnnotationSets.prototype.getVisibleAnnotations = function () {
        var _this = this;
        var result = new Array();
        this.isVisible.forEach(function (annotationTypes, annotationSet) {
            annotationTypes.forEach(function (visible, annotationType) {
                if (visible) {
                    // Add all the annotations from this set/type.
                    _this.annotations.get(annotationSet).get(annotationType).forEach(function (annotation) {
                        result.push(annotation);
                    });
                }
            });
        });
        return result;
    };
    /**
     * Displays the specified annotationSet
     * @param annotationSetType a list of tuples containing the annotation set followed by the annotation type.
     * @returns {Object}
     */
    AnnotationSets.prototype.showAnnotations = function (annotationSetType) {
        var _this = this;
        annotationSetType.forEach(function (_a) {
            var annotationSet = _a[0], annotationType = _a[1];
            if (!_this.isVisible.has(annotationSet)) {
                _this.isVisible.set(annotationSet, new Map());
            }
            _this.isVisible.get(annotationSet).set(annotationType, true);
        });
        // Trigger an event so that the colourField knows to update itself.
        $(this).triggerHandler("visibleAnnotations:changed");
    };
    AnnotationSets.prototype.addAnnotation = function (set, type, startOffset, endOffset) {
        var annotation = new annotation_1.Annotation(type, set, startOffset, endOffset);
        if (!this.annotations.has(set)) {
            this.annotations.set(set, new Map());
        }
        if (!this.annotations.get(set).has(type)) {
            this.annotations.get(set).set(type, new Array());
        }
        this.annotations.get(set).get(type).push(annotation);
        this.showAnnotations([[set, type]]);
        $(this).triggerHandler("annotations:changed");
        return annotation;
    };
    return AnnotationSets;
}());
exports.AnnotationSets = AnnotationSets;
