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
                    '${g.createLink(controller: "annotation", action:"save").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"remove").encodeAsJavaScript()}',
                    '${g.createLink(controller: "annotation", action:"update").encodeAsJavaScript()}'
                );

            $( "#actionAccordion" ).accordion({
                heightStyle: "content"
            });

            window.doc = new Document(endpoints, ${document.id}, function(doc) {
                window.annotationDisplay = new AnnotationDisplay($("#docView"), doc);
                window.annotationSelector = new AnnotationSelector($("#annotationSelector"), doc)
                window.annotationActions = new AnnotationActions($("#actionAccordion"), window.annotationDisplay, doc)
                window.annotationEditor = new AnnotationEditor($("#docView"), window.annotationDisplay, doc)
            });
        });
    </asset:script>
    <div class="container">
            <div class="row">
                <div class="col-md-8" id="actionAccordion">
                    <h1>Add annotation</h1>
                    <div id="annotationAdd">
                        <g:form action="#" id="addAnnotationForm">
                            <label for="type">Set</label>
                            <g:textField name="type" class="annotationSet" />
                            
                            <label for="type">Type</label>
                            <g:textField name="type" class="annotationType" />

                            <g:field type="button" name="add" value="Add" class="createAnnotation">Add</g:field> 
                        </g:form>
                    </div>
                    <h1>Select annotation</h1>

                    <div id="selectAnnotation">
<!--                                 <div class="col-md-6">
                                    <label for="annotationType">Annotation Type</label> <input class="annotationType form-control" type="text" id="annotationType" name="annotationType">

                                    <label>Nudge Annotation</label> <br>
                                    <button class="btn btn-default nudgeLeftEdge" aria-label="Nudge Left Edge">
                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                    </button>

                                    <button class="btn btn-default nudgeRightEdge" aria-label="Nudge Right Edge" >
                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                    </button>

                                    <button class="btn btn-default nudgeLeft" aria-label="Nudge Left Edge" >
                                        <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
                                    </button>

                                    <button class="btn btn-default nudgeRight" aria-label="Nudge Right Edge">
                                        <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
                                    </button>
                                    <button class="btn btn-default deleteAnnotation" aria-label="Delete Annotation">
                                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    </button>

                                    <button class="btn btn-default createAnnotation" aria-label="Create Annotation">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="col-md-6">
                                    <table class="featureValues"></table>
                                </div> -->
                    </div>

                    <h1>Edit annotation</h1>
                    <div id="editAnnotation">
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