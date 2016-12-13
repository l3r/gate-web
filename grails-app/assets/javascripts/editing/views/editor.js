///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../../lib/bootstrap.d.ts"/>
"use strict";
var endpoints_1 = require("../endpoints");
var Editor = (function () {
    function Editor(target, field, document) {
        var _this = this;
        this.showAnnotation = function (tooltipContainer, annotation) {
            console.log("Showing annotation", annotation);
            return tooltipContainer.find(".annotationSelector").replaceWith(_this.showAnnotationHTML(annotation));
        };
        this.showAnnotationHTML = function (annotation) {
            var featureName, newRow, result, table, value, _ref;
            result = $("<div class='annotationEditor'><h2>Editing annotation:</h2>			<fieldset class='form'>				<label for='annotationType'>Annotation Type</label>				<input type='text' name='annotationType' value='" + annotation.type + "' />			</fieldset>			<table class='featureTable'>				<tr> 					<th>Name</th><th>Value</th>				</tr>			</table>			<input type='button' class='submitAnnotation' name='Save' value='Save' class='btn pull-right' />			</div>"); //{annotation.type}' />
            table = result.find("table");
            _ref = annotation.features;
            for (featureName in _ref) {
                value = _ref[featureName];
                newRow = $("					<tr>						<td>" + featureName + "</td>						<td><a class='editableValue'>" + value + "</a></td>					</tr>					"); //{featureName}</td>  //{value}</a></td>
                newRow.find("a.editableValue").editable({
                    type: "text",
                    params: {
                        "documentId": _this.document.id,
                        "annotationSet": annotation.annotationSet,
                        "annotationId": annotation.id
                    },
                    pk: 1,
                    name: featureName,
                    url: endpoints_1.Endpoints.getInstance().saveFeature,
                    title: "Enter feature value"
                });
                table.append(newRow);
            }
            return result;
        };
        this.viewer = $(target);
        this.field = field;
        this.document = document;
        var editor = this; // Store this so we can access it in nested functions.
        this.viewer.popover({
            selector: "span[data-has-annotations=true]",
            html: true,
            placement: "auto right",
            content: function () {
                // Generate the HTML to select an annotation
                return editor.selectAnnotationHTML($(this).data("offset"));
            }
        });
        this.viewer.on("click", "span", function (event) {
            return editor.viewer.find("span").not(event.srcElement).popover("hide").next(".popover").remove();
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
    Editor.prototype.selectAnnotationHTML = function (offset) {
        var _this = this;
        var annotation, annotations, id, item, list, tooltipContainer, _ref;
        tooltipContainer = $("<div class='tooltipContainer'>						<div class='annotationSelector'>						<h2>Please select an annotation to view</h2>						<ul class='annotationList'></ul>						</div>					</div>");
        annotations = this.field.getAnnotations(offset);
        if (Object.keys(annotations).length === 1) {
            for (id in annotations) {
                annotation = annotations[id];
                $.getJSON(endpoints_1.Endpoints.getInstance().getAnnotation, {
                    documentId: this.document.id,
                    annotationSet: annotation.annotationSet,
                    id: annotation.id
                }, function (data) { return _this.showAnnotation(tooltipContainer, data); });
            }
        }
        else {
            list = tooltipContainer.find(".annotationList");
            _ref = this.field.getAnnotations(offset);
            for (id in _ref) {
                annotation = _ref[id];
                item = $("<li><a href='#'>" + id + " " + annotation.type + "</a></li>");
                item.find("a").click(annotation, function (event) {
                    annotation = event.data;
                    return $.getJSON(endpoints_1.Endpoints.getInstance().getAnnotation, {
                        documentId: _this.document.id,
                        annotationSet: annotation.annotationSet,
                        id: annotation.id
                    }, function (data) { return _this.showAnnotation(tooltipContainer, data); });
                });
                list.append($(item));
            }
        }
        return tooltipContainer;
    };
    return Editor;
}());
exports.Editor = Editor;
