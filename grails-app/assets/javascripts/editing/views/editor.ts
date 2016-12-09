var path, target;

class Editor {
    	// I need the display because I need to find out what annotation is being shown at what offset.
    	// Later on, this should probably be refactored into the document so I don't need this reference

    constructor(public target, public display, public document) {
        var editor;
        this.viewer = null;
        		// This will be overriden by the popover library, so I need to keep a reference around.
        editor = this;
        this.target.popover({
            selector: "span[data-has-annotations=true]",
            html: true,
            placement: "auto right",
            content: function() {
                              	// Generate the HTML to select an annotation
                return editor.selectAnnotationHTML($(this).data("offset"));
            }
        });

        this.target.on("click", "span", (event) => {
            console.log(editor.target.find("span"));
            return editor.target.find("span").not(event.toElement).popover("hide").next(".popover").remove();
        });

        this.target.find(".nudgeLeft").on("click", () => this.nudgeAnnotation(-1));

        this.target.find(".nudgeRight").on("click", () => this.nudgeAnnotation(1));

        this.target.find(".nudgeLeftEdge").on("click", () => this.nudgeAnnotationEdge(-1));

        this.target.find(".nudgeRightEdge").on("click", () => this.nudgeAnnotationEdge(1));

        this.target.find(".createAnnotation").on("click", () => this.addAnnotation(1));

        this.target.find(".deleteAnnotation").on("click", () => this.viewer.annotationDisplay.removeAnnotation(this.annotation));
    }

    public selectAnnotationHTML(offset) {
        var annotation, annotations, id, item, list, tooltipContainer, _ref;
        tooltipContainer = $("<div class='tooltipContainer'>						<div class='annotationSelector'>						<h2>Please select an annotation to view</h2>						<ul class='annotationList'></ul>						</div>					</div>");

        annotations = this.document.colourMap.annotationsAt[offset];
        if (Object.keys(annotations).length === 1) {
            for (id in annotations) {
                annotation = annotations[id];
                $.getJSON(this.document.endpoints.getAnnotation, {
                    documentId: this.document.id,
                    annotationSet: annotation.annotationSet,
                    id: annotation.id
                }, (data) => this.showAnnotation(tooltipContainer, data));
            }
        } else {
            list = tooltipContainer.find(".annotationList");
            _ref = this.document.colourMap.annotationsAt[offset];
            for (id in _ref) {
                annotation = _ref[id];
                item = $("<li><a href='#'>" + id + " " + annotation.type + "</a></li>");
                item.find("a").click(annotation, (event) => {
                    annotation = event.data;
                    return $.getJSON(this.document.endpoints.getAnnotation, {
                        documentId: this.document.id,
                        annotationSet: annotation.annotationSet,
                        id: annotation.id
                    }, (data) => this.showAnnotation(tooltipContainer, data));
                });

                list.append($(item));
            }
        }

        return tooltipContainer;
    }

    public showAnnotation = (tooltipContainer, annotation) => {
        console.log("Showing annotation", annotation);
        return tooltipContainer.find(".annotationSelector").replaceWith(this.showAnnotationHTML(annotation));
    }

    public showAnnotationHTML = (annotation) => {
        var featureName, newRow, result, table, value, _ref;
        result = $("<div class='annotationEditor'><h2>Editing annotation:</h2>			<fieldset class='form'>				<label for='annotationType'>Annotation Type</label>				<input type='text' name='annotationType' value='" + annotation.type + "' />			</fieldset>			<table class='featureTable'>				<tr> 					<th>Name</th><th>Value</th>				</tr>			</table>			<input type='button' class='submitAnnotation' name='Save' value='Save' class='btn pull-right' />			</div>");  //{annotation.type}' />

        table = result.find("table");

        _ref = annotation.features;
        for (featureName in _ref) {
            value = _ref[featureName];
            newRow = $("					<tr>						<td>" + featureName + "</td>						<td><a class='editableValue'>" + value + "</a></td>					</tr>					");  //{featureName}</td>  //{value}</a></td>
            newRow.find("a.editableValue").editable({
                type: "text",
                params: {
                    "documentId": this.document.id,
                    "annotationSet": annotation.annotationSet,
                    "annotationId": annotation.id
                },
                pk: 1,
                name: featureName,
                url: this.document.endpoints.saveFeature,
                title: "Enter feature value"
            });

            table.append(newRow);
        }
        return result;
    }

    public nudgeAnnotation(amount) {
        var oldLeft, oldRight;
        oldLeft = this.annotation.indices[0];
        oldRight = this.annotation.indices[1];

        this.annotation.indices[0] += amount;
        this.annotation.indices[1] += amount;

        this.viewer.annotationDisplay.invalidate(Math.min(this.annotation.indices[0], oldLeft), Math.max(this.annotation.indices[1], oldRight));
        return this.showAnnotation(this.annotation, this.display);
    }

    public nudgeAnnotationEdge(amount) {
        var oldLeft, oldRight;
        oldLeft = this.annotation.indices[0];
        oldRight = this.annotation.indices[1];

        if (amount < 0) {
            this.annotation.indices[0] += amount;
        } else {
            this.annotation.indices[1] += amount;
        }

        this.viewer.annotationDisplay.invalidate(Math.min(this.annotation.indices[0], oldLeft), Math.max(this.annotation.indices[1], oldRight));
        return this.showAnnotation(this.annotation, this.display);
    }

    public addAnnotation() {
        var name, offsets, range, sel;
        name = this.target.find(".annotationType").val();

        sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
            range = rangy.getSelection().getRangeAt(0);
            offsets = range.toCharacterRange(this.viewer.annotationDisplay.target.get(0));
            if (offsets.start !== offsets.end) {
                return this.viewer.addAnnotation(name, offsets.start, offsets.end);
            }
        }
    }
}

path = ["editing", "views"];
target = window;

path.forEach((pathPart) => {
    if (!(pathPart in target)) {
        target[pathPart] = {};
    }

    return target = target[pathPart];
});
target.Editor = Editor;
