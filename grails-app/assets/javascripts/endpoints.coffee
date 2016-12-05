class Endpoints
	constructor: (
			@getDocumentAnnotations,
			@getAnnotation,
			@addAnnotation,
			@removeAnnotation,
			@updateAnnotation,
		    @saveFeature
		) ->

window.Endpoints = Endpoints