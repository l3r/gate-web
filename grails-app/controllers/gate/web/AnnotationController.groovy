package gate.web

import gate.AnnotationSet
import gate.Factory
import gate.corpora.DocumentImpl

class AnnotationController {

    def index() { }

    def get(Integer documentId, String annotationSet, Integer id) {
        Document docObj = Document.get(documentId)
        docObj.withDocument { DocumentImpl doc ->
            def annotation = doc.getAnnotations(annotationSet).get(id)
            render (contentType: "application/json") {
                startOffset(annotation.startNode.offset)
                endOffset(annotation.endNode.offset)
                type annotation.type
                delegate.annotationSet annotationSet
                delegate.id id
                features doc.getAnnotations(annotationSet).get(id).features
            }
        }
    }

    def save(Integer documentId, String type, String annotationSet, Long startOffset, Long endOffset) {
        Document docObj = Document.get(documentId)
        docObj.withDocument { DocumentImpl doc ->
            AnnotationSet annotations = doc.getAnnotations(annotationSet)
            def id = annotations.add(startOffset, endOffset, type, Factory.newFeatureMap())

            render (contentType: "application/json") {
                delegate.startOffset startOffset
                delegate.endOffset endOffset
                delegate.type type
                delegate.annotationSet annotationSet
                delegate.id id
                delegate.features annotations.get(id).features
            }

        }
    }
}
