package gate.web

import gate.Annotation
import gate.AnnotationSet
import gate.Factory
import gate.corpora.DocumentImpl

/**
 * Created by dominic on 05/12/2016.
 */
class FeatureController {
    def save(Integer documentId, Integer annotationId, String annotationSet, String name, String value) {
        Document docObj = Document.get(documentId)
        Annotation annotation
        docObj.withDocument { DocumentImpl doc ->
            AnnotationSet annotations = doc.getAnnotations(annotationSet)
            annotation = annotations.get(annotationId)
            annotation.getFeatures().put(name, value);
        }

        render (contentType: "application/json") {
            delegate.annotationSet annotationSet
            delegate.id annotation.id
            delegate.value annotation.features.get(value)
        }
    }

    def saveName(Integer documentId, Integer annotationId, String annotationSet, String name, String value) {
        Document docObj = Document.get(documentId)
        Annotation annotation
        docObj.withDocument { DocumentImpl doc ->
            AnnotationSet annotations = doc.getAnnotations(annotationSet)
            annotation = annotations.get(annotationId)
            def featureValue = annotation.features.remove(name)
            annotation.getFeatures().put(value, featureValue ?: "")
        }

        render (contentType: "application/json") {
            delegate.annotationSet annotationSet
            delegate.id annotation.id
            delegate.value value
        }

    }

}
