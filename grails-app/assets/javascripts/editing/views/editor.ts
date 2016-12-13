///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../../lib/bootstrap.d.ts"/>

import "bootstrap";
import "bootstrap-editable";
import {ColourField} from "../data/colourField";
import {Endpoints} from "../endpoints";
import {Document} from "../data/document";
import {Annotation} from "../data/annotation";

export class Editor {
    private field : ColourField;
    private target : JQuery;
    private document : Document;
    private popover : JQuery;
    private popoverContent : JQuery;

    constructor(target : string, field : ColourField, document : Document) {
        this.field = field;
        this.target = $(target)
        this.document = document
        var editor = this

        this.target.popover({
            selector: "span[data-has-annotations=true]",
            html: true,
            placement: "auto right",
            content: function() {
                // Generate the HTML to select an annotation
                var content = editor.generatePopover($(this).data("offset"));
                console.log(content);
                return content;
            }
        });

        // Hide all other popovers
        this.target.on("click", "span", (event) => {
            return this.target.find("span").not(event.currentTarget).popover("hide").next(".popover").remove();
        });

        // this.target.find(".nudgeLeft").on("click", () => this.nudgeAnnotation(-1));
        //
        // this.target.find(".nudgeRight").on("click", () => this.nudgeAnnotation(1));
        //
        // this.target.find(".nudgeLeftEdge").on("click", () => this.nudgeAnnotationEdge(-1));
        //
        // this.target.find(".nudgeRightEdge").on("click", () => this.nudgeAnnotationEdge(1));
        //
        //
        // this.target.find(".deleteAnnotation").on("click", () => this.viewer.annotationDisplay.removeAnnotation(this.annotation));
    }

    public generatePopover(offset) {
        var annotations : Array<Annotation>;
        this.popover = $(`<div class='tooltipContainer'><div class="content"></div></div>`);


        annotations = this.field.getAnnotations(offset);
        if (annotations.length == 1) {
            this.fetchAndShowAnnotation(annotations[0]);
        } else {
            this.showAnnotationMenu(annotations);
        }

        return this.popover[0];
    }

    public showAnnotationMenu(annotations : Array<Annotation>) {
        var selector = $.parseHTML(`
        <div class='annotationSelector'>
            <h2>Please select an annotation to view</h2>
            <div class='annotationList list-group"'></div>
        </div>
        `);

        var list = $(selector).find(".annotationList");

        for (var annotation of annotations) {
            var annotationDOM = $(`<a href='#' class="list-group-item">${annotation.set}:${annotation.type}</a>`);
            annotationDOM.on("click", annotation, (event) => {
                console.log(event);
                this.fetchAndShowAnnotation(event.data);
            });
            list.append(annotationDOM);
        }

        $(this.popover).children().replaceWith(list);
    }

    public fetchAndShowAnnotation(annotation : Annotation) {
        return $.getJSON(Endpoints.getInstance().getAnnotation, {
            documentId: this.document.id,
            annotationSet: annotation.set,
            id: annotation.id
        }, (data) => this.showAnnotationDetails(Annotation.fromJSON(data)));
    }
    private generateEditableRow(featureName:string, featureValue:string, annotation: Annotation) {
        var newRow = $(`<tr><td><a class='editableName'>${featureName}</a></td>
                        <td><a class='editableValue'>${featureValue}</a></td></tr>`);
        console.log(annotation);
        newRow.find("a.editableValue").editable({
            type: "text",
            params: {
                "documentId": this.document.id,
                "annotationSet": annotation.annotationSet,
                "annotationId": annotation.id
            },
            pk: 1,
            name: featureName,
            url: Endpoints.getInstance().saveFeature,
            title: "Enter feature value"
        });


        newRow.find("a.editableName").editable({
            type: "text",
            params: {
                "documentId": this.document.id,
                "annotationSet": annotation.set,
                "annotationId": annotation.id
            },
            pk: 1,
            name: featureName,
            url: Endpoints.getInstance().saveFeatureName,
            title: "Enter feature name",
            success: (response, newValue) => {
                newRow.find("a.editableValue").editable("destroy");
                newRow.find("a.editableValue").editable({
                    type: "text",
                    params: {
                        "documentId": this.document.id,
                        "annotationSet": annotation.set,
                        "annotationId": annotation.id
                    },
                    pk: 1,
                    name: newValue,
                    url: Endpoints.getInstance().saveFeature,
                    title: "Enter feature value"
                });
                newRow.find("a.editableValue").editable("toggle");
            }
        });


        return newRow;
    }

    public showAnnotationDetails(annotation : Annotation) {
        var result = $(`<form class='annotationEditor'>
            <div class='form-group'>
                <label for='annotationType'>Annotation Type</label>
                <input type='text' name='annotationType' value='${annotation.type}' />
            </div>
            <div class="form-group">
                <table class='featureTable'>
                    <tr> 
                    <th>Name</th><th>Value</th>
                </tr>
                </table>
            </div>
            
            <input type='button' name='addFeature' value='Add Feature' class='btn btn-default addFeature' />
            <input type='button' name='removeAnnotation' value='Remove Annotation' class='btn btn-danger removeAnnotation' />

        </form>`);

        var table = result.find("table");
        jQuery.each(annotation.features, (featureName, featureValue) => {
            table.append(this.generateEditableRow(featureName, featureValue, annotation));
        });

        // Add an event for adding a new feature value.
        result.find(".addFeature").on("click", (e) => {
            e.stopImmediatePropagation()
                var newRow = this.generateEditableRow("", "", annotation);
            table.append(newRow);
            newRow.find("a.editableName").editable("toggle");
            }
        );

        result.find(".removeAnnotation").on("click", (event) => {
            this.document.annotationSets.removeAnnotation(annotation);
            // TODO: Check success here.
            jQuery.post(Endpoints.getInstance().removeAnnotation,
                {   documentId: this.document.id,
                    set: annotation.set,
                    type: annotation.type,
                    id: annotation.id});
            return this.target.find("span").popover("hide").next(".popover").remove();
        });
        $(this.popover).children().replaceWith(result);
    }


    // public nudgeAnnotation(amount) {
    //     var oldLeft, oldRight;
    //     oldLeft = this.annotation.indices[0];
    //     oldRight = this.annotation.indices[1];
    //
    //     this.annotation.indices[0] += amount;
    //     this.annotation.indices[1] += amount;
    //
    //     this.viewer.annotationDisplay.invalidate(Math.min(this.annotation.indices[0], oldLeft), Math.max(this.annotation.indices[1], oldRight));
    //     return this.showAnnotation(this.annotation, this.display);
    // }

    // public nudgeAnnotationEdge(amount) {
    //     var oldLeft, oldRight;
    //     oldLeft = this.annotation.indices[0];
    //     oldRight = this.annotation.indices[1];
    //
    //     if (amount < 0) {
    //         this.annotation.indices[0] += amount;
    //     } else {
    //         this.annotation.indices[1] += amount;
    //     }
    //
    //     this.viewer.annotationDisplay.invalidate(Math.min(this.annotation.indices[0], oldLeft), Math.max(this.annotation.indices[1], oldRight));
    //     return this.showAnnotation(this.annotation, this.display);
    // }
    //
    // public addAnnotation() {
    //     var name, offsets, range, sel;
    //     name = this.target.find(".annotationType").val();
    //
    //     sel = rangy.getSelection();
    //     if (sel.rangeCount > 0) {
    //         range = rangy.getSelection().getRangeAt(0);
    //         offsets = range.toCharacterRange(this.viewer.annotationDisplay.target.get(0));
    //         if (offsets.start !== offsets.end) {
    //             return this.viewer.addAnnotation(name, offsets.start, offsets.end);
    //         }
    //     }
    // }
}

