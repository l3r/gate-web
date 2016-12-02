package gate.web

import static org.springframework.http.HttpStatus.CREATED

class DocumentController {

    def index() { }
    def create() { }

    def save() {
        def document
        if (params.text) {
            document = Document.fromContent(params.text)
        } else if (params.documentFile && params.documentFormat) {
            if (params.documentFile.size > 2000000) { // About 2mb
                flash.message = "Document must be less than 2 MB in size"
                flash.messageType = "failure"
                return redirect(action:'create')
            }

            def url = new URL(null, "file:/"+params.documentFile.name,
                    new ByteArrayURLStreamHandler(params.documentFile.bytes))

            document = Document.fromURL(url, params.documentFormat)
        } else {
            flash.message = "Document must either be supplied as text or uploaded"
            flash.messageType = "failure"
            return redirect(action:'create')
        }

        if (document.save(flush:true)) {
            flash.message = "Document successfully created"
            flash.messageType = "success"
            redirect controller: "documentAnnotations", action: "edit",  id: document.id
        } else {
            flash.message = "Document could not be created"
            flash.messageType = "failure"
            respond document.errors, view:'create'
        }
    }
}
