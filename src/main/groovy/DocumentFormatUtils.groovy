package gate.web
import gate.Annotation
import gate.DocumentFormat
import gate.corpora.DocumentImpl
/**
 * Created by dominic on 02/12/2016.
 */
class DocumentFormatUtils {
    public static final FILE_TYPE_MIMES = [
            "Standoff XML": "application/xml",
            "HTML": "text/html",
            "Plain Text": "text/plain"
    ]

    static exportAllAnnotations(DocumentImpl document) {
        def annotationSetNames = document.getAnnotationSetNames() + ""
        annotationSetNames.collectEntries { asName ->
            // Get the annotation sets by type.
            def annotationSet = document.getAnnotations(asName)
            def annotationTypes = annotationSet.getAllTypes().collectEntries { asType ->
                def annotations = annotationSet.get(asType)
                def offsets = annotations.inDocumentOrder().collect { Annotation annotation ->
                    [
                            startOffset: annotation.startNode.offset,
                            endOffset: annotation.endNode.offset,
                            id: annotation.getId()
                    ]
                }
                [(asType): offsets]
            }
            [(asName): annotationTypes]
        }
    }
}
