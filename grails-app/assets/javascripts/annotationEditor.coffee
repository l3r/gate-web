class AnnotationEditor 
	# I need the display because I need to find out what annotation is being shown at what offset.
	# Later on, this should probably be refactored into the document so I don't need this reference
	constructor: (@target, @display, @document) ->
		@viewer = null
		# This will be overriden by the popover library, so I need to keep a reference around.
		editor = this
		@target.popover({
              selector: 'span[data-has-annotations=true]',
              html: true,
              content: () ->
              	# Generate the HTML to select an annotation
              	editor.selectAnnotationHTML($(this).data("offset")) 
            });

		@target.on "click", "span", (event) ->
			console.log(editor.target.find("span"))
			editor.target.find("span").not(event.toElement).popover('hide').next('.popover').remove()

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

	selectAnnotationHTML: (offset) ->
		result = $("<div class='annotationSelector'><h2>Please select an annotation to view</h2>
			<ul class='annotationList'></ul></div>")
		list = result.find(".annotationList")
		for id, annotation of @display.annotationsAt[offset]
			item = $("<li><a href='#'>#{id} #{annotation.type}</a></li>")
			item.find("a").click annotation, (event) => @showAnnotation(event.data)

			list.append($(item))

		return result
	
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

window.AnnotationEditor = AnnotationEditor