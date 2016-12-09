/**
 * This should be initialised by setting the endpoints using Grails' URL generation.
 *
 * Created by Dominic Rout on 09/12/2016.
 */
export class Endpoints {
    private static _instance:Endpoints = new Endpoints();


    public getDocumentAnnotations : string;
    public getAnnotation : string;
    public addAnnotation : string;
    public removeAnnotation : string;
    public updateAnnotation : string;
    public saveFeature : string;

    public static getInstance():Endpoints {
        return Endpoints._instance;
    }
}