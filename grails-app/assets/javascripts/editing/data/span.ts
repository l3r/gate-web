import {Colour} from "./colour";
import {Annotation} from "./annotation";
/**
 * Contains enough data to construct a span over a section of text in the field viewer.
 *
 * Created by Dominic Rout on 09/12/2016.
 */


export class Span {
    private _start: number
    private _end: number
    private _colour: Colour
    private _annotations: Array<Annotation>

    constructor(start: number, end: number, colour: Colour, annotations: Array<Annotation>) {
        this._start = start;
        this._end = end;
        this._colour = colour;
        this._annotations = annotations;
    }


    get start(): number {
        return this._start;
    }

    get end(): number {
        return this._end;
    }

    get colour(): Colour {
        return this._colour;
    }

    get annotations(): Array<Annotation> {
        return this._annotations;
    }

    addAnnotation
}