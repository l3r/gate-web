
###
#	Encodes the colour values and positions for 
###
class DocumentColourMap
	constructor: (@length) ->
		@colourField = [0..@length].map -> [255,255,255, 0]
		@annotationsAt = [0..@length].map -> {}

	update: (annotations) ->
		@colourField = [0..@length].map -> [255,255,255, 0]
		@annotationsAt = [0..@length].map -> {}

		for annotation in annotations 
			for offset in [annotation.startOffset..(annotation.endOffset-1)]
				@colourField[offset] = @combineAlpha(annotation.colour, @colourField[offset])
				@annotationsAt[offset][annotation.id] = annotation

	combineAlpha: (a, b) ->
		### Combines two colours, appying alpha channel ###
		out = [0,0,0,0]
		alpha = a[3] + b[3]*(1-a[3])
		out[3] = alpha
		for c in [0,1,2]
			out[c] = Math.floor((a[c]*a[3]+b[c]*b[3]*(1-a[3]))/alpha)
		return out

	makeColourString: (colour) ->
		"rgba(#{Math.floor(colour[0])}, #{Math.floor(colour[1])}, #{Math.floor(colour[2])}, #{colour[3]})"

window.DocumentColourMap = DocumentColourMap