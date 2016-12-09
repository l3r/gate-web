var path, target;

class Selector {
    /* Shows a control to allow the user to select which annotation sets are displayed*/

    constructor(public target, public document) {
        this.viewer = null;

        this.show(this.document);

        $(this.document).on("annotations:changed", this.update.bind(this));
    }

    public show(document) {
        this.document = document;
        this.update();
        return this.updateSelection();
    }

    public update() {
        var annotationSelections, annotationSet, annotationType, entry, setAnnotations, typeAnnotations, _ref;
        annotationSelections = $.parseHTML("<form></form>");
        _ref = this.document.annotationSets;
        for (annotationSet in _ref) {
            setAnnotations = _ref[annotationSet];
            $(annotationSelections).append("<h3>" + (annotationSet || "Default Set") + "</h3>");
            for (annotationType in setAnnotations) {
                typeAnnotations = setAnnotations[annotationType];
                entry = $.parseHTML("<label style='color: " + (this.document.colourMap.makeColourString(this.document.annotationTypeColourMap.getTypeColour(annotationSet, annotationType, 1))) + "'>                        <input type='checkbox' name='annotations' value='" + annotationSet + ":" + annotationType + "'> " + annotationType + "</label><br>");  //{annotationSet}:#{annotationType}'> #{annotationType}</label><br>")

                if (this.document.isAnnotationVisible(annotationSet, annotationType)) {
                    $(entry).find("input:checkbox").attr("checked", true);
                }
                $(annotationSelections).append(entry);
            }
        }

        $(annotationSelections).find("input:checkbox").on("change", this.updateSelection.bind(this));
        this.target.empty();
        return this.target.append(annotationSelections);
    }

    public updateSelection() {
        var annotationSets;
        annotationSets = [];
        $(this.target).find("input:checked").map(function() {
            return $(this).val();
        }).each((index, selection) => annotationSets.push(selection));
        this.selected = annotationSets;
        return this.document.showAnnotations(annotationSets);
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
target.Selector = Selector;
