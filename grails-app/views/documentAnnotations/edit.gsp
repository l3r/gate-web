<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'documentAnnotations.label', default: 'Annotations')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
    <asset:script>
        $(document).ready(function() {
            var endpoints = new Endpoints(
                    '${g.createLink(action:"show").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"get").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"save").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"remove").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"update").encodeAsJavaScript()}',
                    '${g.createLink(controller: "feature", action:"save").encodeAsJavaScript()}'
                );



            window.doc = new Document(endpoints, ${document.id}, function(doc) {
                window.annotationDisplay = new AnnotationDisplay($("#docView"), doc);
                window.annotationSelector = new AnnotationSelector($("#annotationSelector"), doc)
                window.annotationActions = new AnnotationActions($("#annotationAdd"), window.annotationDisplay, doc)
                window.annotationEditor = new AnnotationEditor($("#docView"), window.annotationDisplay,doc)
            });
        });
    </asset:script>

    <div class="container">
        <div class="row">
            <div class="col-md-8" id="annotationAdd">
                <h1>Add annotation</h1>
                <g:form action="#" id="addAnnotationForm" class="form-inline">

                    <div class="form-group">
                        <label for="annotationSet">Annotation Set</label>
                        <g:textField class="form-control" name="annotationSet" id="annotationSet" class="annotationSet" placeholder="Original markups" />
                    </div>
                    <div class="form-group">
                        <label for="annotationType">Annotation Type</label>
                        <g:textField class="form-control" name="annotationType" id="annotationType" placeholder="Token" />
                    </div>
                    <g:field type="button" name="add" value="Add" class="createAnnotation btn btn-primary">Add</g:field>
                </g:form>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8">
            <h1>Document Text</h1>

            <div id="docView">
            </div>
        </div>

        <div class="col-md-4">
            <h1>Annotation Selector</h1>
            <div id="annotationSelector">
            </div>
        </div>
    </div>
    </body>
</html>