package gate.web

class BootStrap {
    def documentPoolService

    def init = { servletContext ->
        documentPoolService.initGate()
    }
    def destroy = {
    }
}
