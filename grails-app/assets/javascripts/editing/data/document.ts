///<reference path="../../lib/jquery.d.ts"/>

import {Endpoints} from "../endpoints";
import {AnnotationSets} from "./annotationSets";
import {ColourField} from "./colourField";
import {ColourFieldView} from "../views/colourFieldView";
interface DocumentLoadedCallback { (doc : Document) : void }

/**
 * Brings together all data for the document, including its text, annotation sets, and colour field.
 */
export class Document {

    private _annotationSets : AnnotationSets;
    private _name : string;
    private _text : string;
    private _colourField : ColourField;

    // Goes to the required endpoint and fetches a document, returning it to callback.
    public static fromId(id : number, callback : DocumentLoadedCallback) {
        let endpoints = Endpoints.getInstance();

        $.getJSON(endpoints.getDocumentAnnotations, {"id": id}, (data) => {
           callback(new Document(data));
        });
    }

    constructor(data) {
        // $(this).on("annotations:changed", () => $(this).triggerHandler("visibleAnnotations:changed"));
        this._text = data._text;
        this._name = data._name;
        this._annotationSets = AnnotationSets.fromJson(data._annotationSets);
        this._colourField = new ColourField(this._text.length, this._annotationSets);
    }

    get colourField() : ColourField {
        return this._colourField;
    }

    get annotationSets(): AnnotationSets {
        return this._annotationSets;
    }

    get name(): string {
        return this._name;
    }

    get text(): string {
        return this._text;
    }

    public getColourFieldView() : ColourFieldView {
        return new ColourFieldView(this.text, this.colourField);
    }
}

