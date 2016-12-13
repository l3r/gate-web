/**
 * Represents an RGBA colour with methods for mixing and comparison
 *
 * Created by Dominic Rout on 09/12/2016.
 */
export class Colour {
    private _r : number
    private _g : number
    private _b : number
    private _a : number


    constructor(r: number, g: number, b: number, a: number) {
        this._r = Math.floor(r);
        this._g = Math.floor(g);
        this._b = Math.floor(b);
        this._a = a;
    }

    public static fromRGB(colour : [number, number, number]) {
        return new Colour(colour[0], colour[1], colour[2], 1);
    }
    public withAlpha(a: number) : Colour {
        return new Colour(this._r, this._g , this._b, a);
    }


    get r(): number {
        return this._r;
    }

    get g(): number {
        return this._g;
    }

    get b(): number {
        return this._b;
    }

    get a(): number {
        return this._a;
    }

    get rgbString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    public combineAlpha(other) : Colour {
        /* Combines two colours, appying alpha channel*/
        var r, g, b, alpha;
        alpha = this.a + other.a * (1 - this.a);
        r = Math.floor((other.r * this.a + other.r * other.a * (1 - this.a)) / alpha);
        g = Math.floor((other.g * this.a + other.g * other.a * (1 - this.a)) / alpha);
        b = Math.floor((other.b * this.a + other.b * other.a * (1 - this.a)) / alpha);
        return new Colour(r, g, b, alpha);
    }

    public equals(other : Colour) : boolean {
        return this.r == other.r &&
                this.g == other.g &&
                this.b == other.b &&
                this.a == other.a;
    }

    public toString() {
        return this.rgbString;
    }
}