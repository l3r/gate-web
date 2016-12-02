package gate.web

import gate.Utils
import gate.Factory
import gate.corpora.DocumentImpl

class Document {

    String documentSource

    def withDocument(closure) {
        def document = (DocumentImpl) Factory.createResource("gate.corpora.DocumentImpl",
                Utils.featureMap("stringContent", documentSource, "mimeType", "application/xml"))

        closure(document)

        documentSource = document.toXml()

        Factory.deleteResource(document)
    }

    static fromContent(String content, String mimeType = "text/plain") {
        def documentObj = (DocumentImpl) Factory.createResource("gate.corpora.DocumentImpl",
                Utils.featureMap("stringContent", content, "mimeType", mimeType))

        def document = new Document(documentSource: documentObj.toXml())

        Factory.deleteResource(documentObj)

        return document
    }

    static fromURL(URL documentURL, String mimeType = "text/plain") {
        def documentObj = (DocumentImpl) Factory.createResource("gate.corpora.DocumentImpl",
                Utils.featureMap("sourceUrl", documentURL, "mimeType", mimeType))

        def document = new Document(documentSource: documentObj.toXml())

        Factory.deleteResource(documentObj)

        return document
    }

    static constraints = {
        documentSource(nullable: false, maxSize: 2000000 /* 2MB */)
    }
}
