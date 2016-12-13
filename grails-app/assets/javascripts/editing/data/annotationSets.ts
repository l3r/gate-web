
///<reference path="../../lib/core-js.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>

import {Colour} from "./colour";
import {Annotation} from "./annotation";
var colours;

colours = [[31, 119, 180], [174, 199, 232], [255, 127, 14], [255, 187, 120], [44, 160, 44], [152, 223, 138],
    [214, 39, 40], [255, 152, 150], [148, 103, 189], [197, 176, 213], [140, 86, 75], [196, 156, 148],
    [227, 119, 194], [247, 182, 210], [127, 127, 127], [199, 199, 199], [188, 189, 34],
    [219, 219, 141], [23, 190, 207], [158, 218, 229]];


export type AnnotationKey = [string, string];

/**
 * Stores the map of annotation sets onto types plus their colours.
 */
export class AnnotationSets {
    private typeColours : Map<String, Map<String, Colour>>;
    private lastColourUsed : number;
    private _annotations : Map<String, Map<String, Array<Annotation>>>;
    private isVisible : Map<String, Map<String, boolean>>;

    constructor() {
        this.lastColourUsed = 0;
        this.typeColours = new Map<String, Map<String, Colour>>();
        this._annotations = new Map<String, Map<String, Array<Annotation>>>();
        this.isVisible = new Map<String, Map<String, boolean>>();
    }

    /**
     * Reads the collection of annotations from a JSON data structure.
     * @param json
     */
    public static fromJson(json) : AnnotationSets {
        var result = new AnnotationSets()

        for (var annotationSet in json) {
            for (var annotationType in json[annotationSet]) {
                for (var annotation of json[annotationSet][annotationType]) {
                    result.addAnnotation(
                        new Annotation(annotationSet,
                        annotationType,
                        annotation.startOffset,
                        annotation.endOffset,
                        annotation.id));
                }
            }
        }

        return result
    }

    /**
     * Generates a colour for the given type, or retrieves it if there already is one.
     * @param annotationSet Annotation Sert of interest.
     * @param type Annotation Type of interest
     * @param alpha
     * @returns {string|T[]|any|number[]}
     */
    public typeColour(annotationSet : string, type : string, alpha : number = 0.3) {
        var colour;
        if (this.typeColours.has(annotationSet) &&
            this.typeColours.get(annotationSet).has(type)) {
            return this.typeColours.get(annotationSet).get(type).withAlpha(alpha);
        } else {
            // Get the next colour to use.
            colour = Colour.fromRGB(colours[this.lastColourUsed]);
            this.lastColourUsed += 1;
            if (this.lastColourUsed === colours.length) {
                this.lastColourUsed = 0;
            }

            if (!this.typeColours.has(annotationSet)) {
                this.typeColours.set(annotationSet, new Map<String, Colour>());
            }
            this.typeColours.get(annotationSet).set(type, colour);

            return colour;
        }
    }

    public isAnnotationVisible(annotationSet, annotationType) {
        return this.isVisible.has(annotationSet)
            && this.isVisible.get(annotationSet).has(annotationType)
            && this.isVisible.get(annotationSet).get(annotationType) == true;
    }

    /**
     * Produces a flat list of annotations that should be displayed in the document.
     * @returns {any}
     */
    get visibleAnnotations(): Array<Annotation> {
        var result = new Array<Annotation>();
        this.isVisible.forEach((annotationTypes : Map<string, boolean>, annotationSet) => {
            annotationTypes.forEach((visible : boolean, annotationType: string) => {
                if (visible) {
                    // Add all the annotations from this set/type.
                    this._annotations.get(annotationSet).get(annotationType).forEach((annotation : Annotation) => {
                       result.push(annotation);
                    });
                }
            });
        });

        return result;
    }


    get annotations(): Map<String, Map<String, Array<Annotation>>> {
        return this._annotations;
    }

    /**
     * Displays the specified annotation sets. All other annotation sets will be hidden.
     * @param annotationSetType a list of tuples containing the annotation set followed by the annotation type.
     * @returns {Object}
     */
    public showAnnotations(annotationSetType : Array<AnnotationKey>) {
        this.isVisible = new Map<String, Map<String, boolean>>();
        annotationSetType.forEach(([annotationSet, annotationType]) => {
            if (!this.isVisible.has(annotationSet)) {
                this.isVisible.set(annotationSet, new Map<string, boolean>());
            }

            this.isVisible.get(annotationSet).set(annotationType, true);
        });

        // Trigger an event so that the colourField knows to update itself.
        $(this).triggerHandler("visible:changed");
    }

    public addAnnotation(annotation : Annotation) : Annotation {
        if (!this._annotations.has(annotation.set)) {
            this._annotations.set(annotation.set, new Map<string, Array<Annotation>>());
        }

        if (!this._annotations.get(annotation.set).has(annotation.type)) {
            this._annotations.get(annotation.set).set(annotation.type, new Array<Annotation>());
        }
        this._annotations.get(annotation.set).get(annotation.type).push(annotation);

        this.showAnnotations([[annotation.set, annotation.type]]);

        $(this).triggerHandler("all:changed", {start: annotation.startOffset, end: annotation.endOffset});
        $(this).triggerHandler("visible:changed", {start: annotation.startOffset, end: annotation.endOffset});

        return annotation;
    }

    public removeAnnotation(annotation : Annotation) {
        if (this._annotations.has(annotation.set)) {
            if (this._annotations.get(annotation.set).has(annotation.type)) {
                var siblings = this._annotations.get(annotation.set).get(annotation.type);

                for (var i = 0; i < siblings.length; i++) {
                    if (siblings[i].id == annotation.id) {
                        siblings.splice(i,1);
                    }
                }
            }
        }
        $(this).triggerHandler("all:changed", {start: annotation.startOffset, end: annotation.endOffset});
        $(this).triggerHandler("visible:changed", {start: annotation.startOffset, end: annotation.endOffset});

    }
}
