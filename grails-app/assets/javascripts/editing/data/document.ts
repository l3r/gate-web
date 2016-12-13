///<reference path="../../lib/jquery.d.ts"/>
import * as $ from "jquery";
import {Endpoints} from "../endpoints";
import {AnnotationSets} from "./annotationSets";
import {ColourField} from "./colourField";
interface DocumentLoadedCallback { (doc : Document) : void }

/**
 * Brings together all data for the document, including its text, annotation sets, and colour field.
 */
export class Document {

    private _annotationSets : AnnotationSets;
    private _name : string;
    private _text : string;
    private _colourField : ColourField;
    private _id : number;

    // Goes to the required endpoint and fetches a document, returning it to callback.
    public static fromId(id : number, callback : DocumentLoadedCallback) {
        let endpoints = Endpoints.getInstance();

        $.getJSON(endpoints.getDocumentAnnotations, {"id": id}, (data) => {
           callback(new Document(data));
        });
    }

    constructor(data) {
        // $(this).on("annotations:changed", () => $(this).triggerHandler("visibleAnnotations:changed"));
        this._id = data.id;
        this._text = data.text;
        this._name = data.name;
        this._annotationSets = AnnotationSets.fromJson(data.annotationSets);
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


    get id(): number {
        return this._id;
    }
}

