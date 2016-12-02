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
				@document.addAnnotation(set, type, offsets.start, offsets.end)

window.AnnotationActions = AnnotationActions