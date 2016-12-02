<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'document.label', default: 'Document')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <a href="#create-document" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="create-document" class="content scaffold-create" role="main">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${this.document}">
            <ul class="errors" role="alert">
                <g:eachError bean="${this.document}" var="error">
                <li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
                </g:eachError>
            </ul>
            </g:hasErrors>
            <g:uploadForm action="save">
                <fieldset class="form">
                    <label for="text">Document Text</label>
                    <g:textArea name="text" rows="20" cols="40" />
                </fieldset>
                <fieldset class="form">

                    <label for="documentFile">Document File</label>
                    <input type="file" name="documentFile" />

                </fieldset>
                <fieldset class="form">
                    <label for="documentFormat">Upload Format</label>
                    <g:select name="documentFormat" from="${gate.web.DocumentFormatUtils.FILE_TYPE_MIMES}" optionKey="value" optionValue="key"/>
                </fieldSet>
                <fieldset class="buttons">
                <div class="fieldcontain">
                    <g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" />
                 </div>
                </fieldset>
            </g:uploadForm>
        </div>
    </body>
</html>
