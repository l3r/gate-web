/*
//	Encodes the colour values at each position of the document text.
*/

import {Colour} from "./colour";
import {AnnotationSets} from "./annotationSets";
import {Annotation} from "./annotation";
import * as $ from "jquery";

export type BitMap = Array<Colour>;
export type AnnotationMap = Array<Array<Annotation>>;


export class ColourField {
    private colourField : BitMap;
    private annotationsAt : AnnotationMap
    private annotationSets : AnnotationSets;

    constructor(length : number, annotationSets: AnnotationSets) {
        this.annotationSets = annotationSets;
        this.colourField = new Array<Colour>(length);
        this.colourField.fill(new Colour(255,255,255,0))

        this.annotationsAt = new Array<Array<Annotation>>(length);
        this.annotationsAt.fill([]);

        $(annotationSets).on("visible:changed", (event, data) => {

            console.log("visible:changed", data);
                if (data) {
                    this.update(data.start, data.end);
                } else {
                    this.update();
                }
            }
        );

        this.update();
    }

    public update(start : number = null, end : number = null) {
        if (start == null) {
            start = 0;
        }

        if (end == null) {
            end = this.colourField.length;
        }
        var visible = this.annotationSets.visibleAnnotations

        // First, reset the colour field and annotations lists.
        for (var i = start; i < end; i++) {
            this.colourField[i] = new Colour(255,255,255,0);
            this.annotationsAt[i] = [];
        }


        // Fill in the colour for each individual annotation.
        visible.forEach((annotation : Annotation) => {
            var startOffset = annotation.startOffset;
            var endOffset = annotation.endOffset;

            // Only fill annotations within the specified range. Search is currently very slow. Sort the annotations?
            if (startOffset < end && endOffset > start) {``
                startOffset = Math.max(startOffset, start);
                endOffset = Math.min(endOffset, end);

                for (var i = startOffset; i < endOffset; i++) {
                    var annotationColour = this.annotationSets.typeColour(annotation.set, annotation.type)
                    this.colourField[i] = this.colourField[i].combineAlpha(annotationColour);
                    this.annotationsAt[i].push(annotation)
                }
            }
        });
        $(this).triggerHandler("changed", {start: start, end:end});
    }

    public get(offset : number) : Colour {
        return this.colourField[offset];
    }

    public getAnnotations(offset: number) : Array<Annotation> {
        return this.annotationsAt[offset];
    }
}

