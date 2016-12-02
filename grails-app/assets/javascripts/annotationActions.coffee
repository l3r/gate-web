###
#	Shows a menu bar for annotation creation, and for selecting an annotation to edit.
###
class AnnotationActions
	# I need to know about annotationDisplay so I can see where you're clicking in it.
	constructor: (@target, @annotationDisplay, @document) ->
		@target.find(".createAnnotation").on "click", () =>
			@addAnnotation(@target.find(".annotationSet").val(), @target.find(".annotationType").val())

	addAnnotation: (set, type) ->
		sel = rangy.getSelection()
		if sel.rangeCount > 0
			range = rangy.getSelection().getRangeAt(0)

			offsets = range.toCharacterRange(@annotationDisplay.target.get(0))
			if offsets.start != offsets.end
				annotation = {
					type: type,
					features: {},
					annotationSet: set,
					startOffset: offsets.start,
					endOffset: offsets.end
					documentId: @document.id
				}

				@target.find("#detailsForm").replaceWith(annotationEditor.showAnnotationHTML(annotation))
				@target.find(".submitAnnotation").on "click", annotation, (event) =>
					annotation = event.data

					$.post @document.endpoints.addAnnotation, annotation, (data) =>
						console.log(data)
						@document.addAnnotation(data)

window.AnnotationActions = AnnotationActions