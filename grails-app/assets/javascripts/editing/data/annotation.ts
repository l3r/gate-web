/**
 * Created by Dominic Rout on 09/12/2016.
 */

export class Annotation {
    private _type : string;
    private _set : string;
    private _startOffset : number;
    private _endOffset : number;
    private _features : Map<any, any>;
    private _id : number;


    constructor(set: string, type: string, startOffset: number,
                endOffset: number, id: number, features = null) {
        this._type = type;
        this._set = set;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
        this._id = id;
        this._features = features;
    }

    public static fromJSON(json) : Annotation {
        return new Annotation(json.set, json.type, json.startOffset,
                json.endOffset, json.id, json.features);
    }
    get type(): string {
        return this._type;
    }

    get set(): string {
        return this._set;
    }

    get startOffset(): number {
        return this._startOffset;
    }

    get endOffset(): number {
        return this._endOffset;
    }

    get id(): number {
        return this._id;
    }

    get features(): Map<any, any> {
        return this._features;
    }
}