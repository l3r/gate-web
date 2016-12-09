/**
 * Created by Dominic Rout on 09/12/2016.
 */

export class Annotation {
    private _type : string
    private _set : string
    private _startOffset : number
    private _endOffset : number


    constructor(type: string, set: string, startOffset: number, endOffset: number) {
        this._type = type;
        this._set = set;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
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
}