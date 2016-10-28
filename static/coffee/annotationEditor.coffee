class AnnotationEditor 
	constructor: (@target) ->
		@viewer = null
		@target.find(".nudgeLeft").on "click", () =>
			@nudgeAnnotation(-1)

		@target.find(".nudgeRight").on "click", () =>
			@nudgeAnnotation(1)

		@target.find(".nudgeLeftEdge").on "click", () =>
			@nudgeAnnotationEdge(-1)

		@target.find(".nudgeRightEdge").on "click", () =>
			@nudgeAnnotationEdge(1)

		@target.find(".createAnnotation").on "click", () =>
			@addAnnotation(1)

		@target.find(".deleteAnnotation").on "click", () =>
			@viewer.annotationDisplay.removeAnnotation(@annotation)



	showAnnotation: (@annotation) =>
		console.log("Showing annotation", @annotation)
		@target.find(".annotationType").val(@annotation.type)
		@target.find(".featureValues").empty()
		for feature, value of @annotation
			@target.find(".featureValues").append($.parseHTML("<tr><td>#{feature}</td><td>#{value}</td></tr>"))



	nudgeAnnotation: (amount) ->
		oldLeft = @annotation.indices[0]
		oldRight = @annotation.indices[1]

		@annotation.indices[0] += amount
		@annotation.indices[1] += amount

		@viewer.annotationDisplay.invalidate(Math.min(@annotation.indices[0], oldLeft),
							Math.max(@annotation.indices[1], oldRight))
		@showAnnotation(@annotation, @display)

	nudgeAnnotationEdge: (amount) ->
		oldLeft = @annotation.indices[0]
		oldRight = @annotation.indices[1]

		if (amount < 0)
			@annotation.indices[0] += amount
		else
			@annotation.indices[1] += amount

		@viewer.annotationDisplay.invalidate(Math.min(@annotation.indices[0], oldLeft),
							Math.max(@annotation.indices[1], oldRight))
		@showAnnotation(@annotation, @display)

	addAnnotation: () ->
		name = @target.find(".annotationType").val()

		sel = rangy.getSelection()
		if sel.rangeCount > 0
			range = rangy.getSelection().getRangeAt(0)
			offsets = range.toCharacterRange(@viewer.annotationDisplay.target.get(0))
			if offsets.start != offsets.end
				@viewer.addAnnotation(name, offsets.start, offsets.end)