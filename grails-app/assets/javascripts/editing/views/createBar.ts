///<reference path="../../lib/rangy.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
/*
//	Shows a menu bar for annotation creation, and for selecting an annotation to edit.
*/

var path, target;

class CreateBar {
    	// I need to know about annotationDisplay so I can see where you're clicking in it.

    constructor(public target, public annotationDisplay, public document) {
        this.target.find(".createAnnotation").on("click", () => this.addAnnotation(this.target.find(".annotationSet").val(), this.target.find(".annotationType").val()));
    }

    public addAnnotation(set, type) {
        var annotation, offsets, range, sel;
        sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
            range = rangy.getSelection().getRangeAt(0);

            offsets = range.toCharacterRange(this.annotationDisplay.target.get(0));
            if (offsets.start !== offsets.end) {
                annotation = {
                    type: type,
                    features: {},
                    annotationSet: set,
                    startOffset: offsets.start,
                    endOffset: offsets.end,
                    documentId: this.document.id
                };

                //this.target.find("#detailsForm").replaceWith(annotationEditor.showAnnotationHTML(annotation));
                return this.target.find(".submitAnnotation").on("click", annotation, (event) => {
                    annotation = event.data;

                    return $.post(this.document.endpoints.addAnnotation, annotation, (data) => {
                        console.log(data);
                        return this.document.addAnnotation(Annotation.fromJSON(data));
                    });
                });
            }
        }
    }
}
