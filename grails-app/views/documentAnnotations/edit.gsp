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
                    '${g.createLink(controller: "annotation", action:"update").encodeAsJavaScript()}'
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
                <div class="col-md-8" >
                    <h1>Add annotation</h1>
                    <div id="annotationAdd">
                        <g:form action="#" id="addAnnotationForm">
                            <label for="type">Set</label>
                            <g:textField name="type" class="annotationSet" />
                            
                            <label for="type">Type</label>
                            <g:textField name="type" class="annotationType" />

                            <g:field type="button" name="add" value="Add" class="createAnnotation">Add</g:field> 
                        </g:form>

                        <div id='detailsForm' />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <h2>Document Text</h2>

                    <div id="docView">
                    </div>
                </div>

                <div class="col-md-4">
                    <h2>Annotation Selector</h2>
                    <div id="annotationSelector">
                    </div>
                </div>

                <div class="col-md-4">
                    <h2>Annotations at Cursor</h2>
                    <div id="annotationInfo">
                    </div>
                </div>
            </div>
        </div>

    </body>
</html>