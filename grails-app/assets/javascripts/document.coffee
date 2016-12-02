colours = [[31 , 119, 180],
	  [174, 199, 232],
	  [255, 127, 14],
	  [255, 187, 120],
	  [44 , 160, 44],
	  [152, 223, 138],
	  [214, 39 , 40],
	  [255, 152, 150],
	  [148, 103, 189],
	  [197, 176, 213],
	  [140, 86 , 75],
	  [196, 156, 148],
	  [227, 119, 194],
	  [247, 182, 210],
	  [127, 127, 127],
	  [199, 199, 199],
	  [188, 189, 34],
	  [219, 219, 141],
	  [23 , 190, 207],
	  [158, 218, 229]]
lastColourUsed = 0

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
			@text = data.text
			@name = data.name
			@annotationSets = data.annotationSets
			@_visibleAnnotations = {}
			@typeColours = {}
			callback(@)

	constructor: (@endpoints, @id, callback = ID) ->
		# Data structure for annotations changing implies the display has changed too.
		$(@).on("annotations:changed", () => $(@).triggerHandler("visibleAnnotations:changed"))

		@fetchDocument(callback)

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
						annotation.colour = @getTypeColour(annotationSet, annotationType)
						annotation.type = annotationType
						annotations.push(annotation)

		return annotations

	makeColourString: (colour) ->
	    "rgba(#{Math.floor(colour[0])}, #{Math.floor(colour[1])}, #{Math.floor(colour[2])}, #{colour[3]})"

	getTypeColour: (annotationSet, type, alpha=0.3) ->
		### 
		  Generates a colour for the given type, or retrieves it if there already is one.
		###
		key = "#{annotationSet}:#{type}"
		if @typeColours.hasOwnProperty(key)
			return [@typeColours[key]..., alpha]
		else 
			colour = colours[lastColourUsed] 
			lastColourUsed += 1
			if lastColourUsed == colours.length
				lastColourUsed = 0

			@typeColours[key] = colour

			return [colour..., alpha]

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

	addAnnotation: (annotationSet, annotationType, start, end) ->
		if (!@annotationSets.hasOwnProperty(annotationSet))
			@annotationSets[annotationSet] = {}
		if (!@annotationSets[annotationSet].hasOwnProperty(annotationType))
			@annotationSets[annotationSet][annotationType] = []

		@annotationSets[annotationSet][annotationType].push({startOffset: start, endOffset: end})
		console.log(@annotationSets[annotationSet][annotationType])
		
		if !@_visibleAnnotations.hasOwnProperty(annotationSet)
				@_visibleAnnotations[annotationSet] = {}
			@_visibleAnnotations[annotationSet][annotationType] = true

		$(this).triggerHandler("annotations:changed")

window.Document = Document