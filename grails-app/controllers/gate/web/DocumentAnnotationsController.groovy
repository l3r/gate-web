package gate.web

import gate.AnnotationSet
import gate.corpora.DocumentImpl

import static org.springframework.http.HttpStatus.NOT_FOUND

class DocumentAnnotationsController {

    def index() { }

    def show() {
        Document document = Document.get(params.id)

        if (document == null) {
            return notFound()
        }

        document.withDocument { DocumentImpl doc ->
            render (contentType: "application/json") {
                name doc.getName()
                text doc.getContent().toString()
                annotationSets DocumentFormatUtils.exportAllAnnotations(doc)
            }
        }
    }

    def edit() {
        Document document = Document.get(params.id)
        if (document == null) {
            notFound()
        }
        respond document
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: '${propertyName}.label', default: '${className}'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
