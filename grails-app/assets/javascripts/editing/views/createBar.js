///<reference path="../../lib/rangy.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
/*
//	Shows a menu bar for annotation creation, and for selecting an annotation to edit.
*/
var path, target;
var CreateBar = (function () {
    // I need to know about annotationDisplay so I can see where you're clicking in it.
    function CreateBar(target, annotationDisplay, document) {
        var _this = this;
        this.target = target;
        this.annotationDisplay = annotationDisplay;
        this.document = document;
        this.target.find(".createAnnotation").on("click", function () { return _this.addAnnotation(_this.target.find(".annotationSet").val(), _this.target.find(".annotationType").val()); });
    }
    CreateBar.prototype.addAnnotation = function (set, type) {
        var _this = this;
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
                return this.target.find(".submitAnnotation").on("click", annotation, function (event) {
                    annotation = event.data;
                    return $.post(_this.document.endpoints.addAnnotation, annotation, function (data) {
                        console.log(data);
                        return _this.document.addAnnotation(data);
                    });
                });
            }
        }
    };
    return CreateBar;
}());
