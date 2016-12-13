///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../../lib/bootstrap.d.ts"/>

import {Document} from "../data/document"

import {AnnotationSets} from "../data/annotationSets";
import {Annotation} from "../data/annotation";
import {Colour} from "../data/colour";

export class Selector {
    /* Shows a control to allow the user to select which annotation sets are displayed*/
    private target : JQuery;
    private annotationSets : AnnotationSets;

    constructor(annotationSets : AnnotationSets, target : string) {
        this.annotationSets = annotationSets;
        this.target = $(target);

        $(this.annotationSets).on("all:changed", this.update.bind(this));
    }

    public static create(document : Document, target: string) : Selector {
        var result = new Selector(document.annotationSets, target);
        result.update();
        result.updateSelection();

        return result;
    }

    public update() {
        var annotationType, entry, setAnnotations, typeAnnotations, _ref;
        var annotationSelections = $.parseHTML("<form></form>");
        console.log(this.annotationSets.annotations)
        this.annotationSets.annotations.forEach((annotationTypes : Map<String, Annotation[]>,
                                                 annotationSet : string) => {
            $(annotationSelections).append("<h3>" + (annotationSet || "Default Set") + "</h3>");

            annotationTypes.forEach((annotations: Annotation[], annotationType : string ) => {
                var colour : Colour = this.annotationSets.typeColour(annotationSet, annotationType, 1);

                //noinspection CssInvalidPropertyValue
                var entry = $.parseHTML(`<label style='color: ${colour.rgbString}'>
                    <input type='checkbox' name='annotations' value='${annotationSet}:${annotationType}'>
                    ${annotationType}</label><br>`);

                // Select this entry in the list if it's supposed to already be visible.
                if (this.annotationSets.isAnnotationVisible(annotationSet, annotationType)) {
                    $(entry).find("input:checkbox").attr("checked", "checked");
                }

                $(annotationSelections).append(entry);
            });
        });
        $(annotationSelections).find("input:checkbox").on("change", this.updateSelection.bind(this));
        this.target.empty();
        return this.target.append(annotationSelections);
    }

    public updateSelection() {
        var annotationSets : Array<[string, string]>;
        annotationSets = [];
        $(this.target).find("input:checked").map(function() : string {
            return $(this).val();
        }).each((index, selection : any) => {
            var splitSelection : Array<string> = selection.split(":");

            annotationSets.push([splitSelection[0], splitSelection[1]]); // Converts to a tuple
        });

        //this.selected = annotationSets;
        return this.annotationSets.showAnnotations(annotationSets);
    }


}

