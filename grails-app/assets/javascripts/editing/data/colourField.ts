/*
//	Encodes the colour values at each position of the document text.
*/

import {Colour} from "./colour";
import {AnnotationSets} from "./annotationSets";
import {Annotation} from "./annotation";

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
    }

    public update() {
        var visible = this.annotationSets.getVisibleAnnotations()

        // First, reset the colour field and annotations lists.
        this.colourField.fill(new Colour(255,255,255,0))
        this.annotationsAt.fill([]);

        // Fill in the colour for each individual annotation.
        visible.forEach((annotation : Annotation) => {
            for (var i = annotation.startOffset; i < annotation.endOffset; i++) {
                var annotationColour = this.annotationSets.typeColour(annotation.set, annotation.type)

                this.colourField[i] = this.colourField[i].combineAlpha(annotationColour);
                this.annotationsAt[i].push(annotation)
            }
        });
    }

    public get(offset : number) : Colour {
        return this.colourField[offset];
    }

    public getAnnotations(offset: number) : Array<Annotation> {
        return this.annotationsAt[offset];
    }
}

