/**
 * This should be initialised by setting the endpoints using Grails' URL generation.
 *
 * Created by Dominic Rout on 09/12/2016.
 */
export class Targets {
    private static _instance:Targets = new Targets();

    public textField : string;
    public annotationSetList : string;
    public newAnnotationForm : string;

    public static getInstance():Targets {
        return Targets._instance;
    }
}