package gate.web

import gate.Factory
import gate.Gate
import grails.core.GrailsApplication
import grails.transaction.Transactional

import javax.annotation.PostConstruct

@Transactional
/**
 * Service to cache documents so that they hang around in memory a little while after being loaded.
 * This is potentially useful because document loading could get expensive.
 */
class DocumentPoolService {
    GrailsApplication grailsApplication;
    def initGate() {
        if (!Gate.isInitialised()) {
            Gate.setGateHome(grailsApplication.getMainContext().getResource("WEB-INF/GATE/").getFile());

            Gate.init();
        }
    }

    def withDocument(id, closure) {
        def documentRecord = Document.get(id)

        documentRecord.withDocument closure
    }
}
