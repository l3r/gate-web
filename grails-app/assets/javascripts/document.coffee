

ID = () ->
	
###
#	Represents the document text, the annotation sets it contains and the colouring
#	for those annotation sets. 
#
#	This object exists largely as a broker for events
###
class Document
	# Fetches the document for the current ID and sets fields accordingly.
	# TODO: report error if document could not be fetched.
	fetchDocument: (callback = ID) ->
		$.getJSON @endpoints.getDocumentAnnotations, {id: @id}, (data) =>
			@colourMap = new DocumentColourMap(data.text.length)
			@text = data.text
			@name = data.name
			@annotationSets = data.annotationSets
			@_visibleAnnotations = {}
			
			callback(@)

	constructor: (@endpoints, @id, callback = ID) ->
		# Data structure for annotations changing implies the display has changed too.
		@fetchDocument(callback)
		$(@).on("annotations:changed", () => $(@).triggerHandler("visibleAnnotations:changed"))
		@colourMap = new DocumentColourMap(0)
		@annotationTypeColourMap = new AnnotationTypeColourMap()

	isAnnotationVisible: (annotationSet, annotationType) ->
		return @_visibleAnnotations.hasOwnProperty(annotationSet) and
				@_visibleAnnotations[annotationSet].hasOwnProperty(annotationType) and 
				@_visibleAnnotations[annotationSet][annotationType] == true

	getVisibleAnnotations: () ->
		annotations = []
		for annotationSet, setAnnotations of @annotationSets
			for annotationType, typeAnnotations of setAnnotations
				if @isAnnotationVisible(annotationSet, annotationType)
					for annotation in typeAnnotations
						annotation.colour = @annotationTypeColourMap.getTypeColour(annotationSet, annotationType)
						annotation.type = annotationType
						annotations.push(annotation)

		return annotations


	showAnnotations: (keys) ->
		@_visibleAnnotations = {}
		for key in keys
			keyParts = key.split(":")
			annotationSet = keyParts[0]
			annotationType = keyParts[1]

			if !@_visibleAnnotations.hasOwnProperty(annotationSet)
				@_visibleAnnotations[annotationSet] = {}
			@_visibleAnnotations[annotationSet][annotationType] = true

		$(this).triggerHandler("visibleAnnotations:changed")

	addAnnotation: (a) ->
		if (!@annotationSets.hasOwnProperty(a.annotationSet))
			@annotationSets[a.annotationSet] = {}
		if (!@annotationSets[a.annotationSet].hasOwnProperty(a.type))
			@annotationSets[a.annotationSet][a.type] = []

		@annotationSets[a.annotationSet][a.type].push(a)
		
		if !@_visibleAnnotations.hasOwnProperty(a.annotationSet)
				@_visibleAnnotations[a.annotationSet] = {}
			@_visibleAnnotations[a.annotationSet][a.type] = true

		$(this).triggerHandler("annotations:changed")

window.Document = Document