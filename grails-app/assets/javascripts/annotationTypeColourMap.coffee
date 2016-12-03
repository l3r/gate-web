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

###
#	Maps an annotation type onto a colour.
###
class AnnotationTypeColourMap
	constructor: () ->
		@lastColourUsed = 0
		@typeColours = {}
		
	getTypeColour: (annotationSet, type, alpha=0.3) ->
		### 
		  Generates a colour for the given type, or retrieves it if there already is one.
		###
		key = "#{annotationSet}:#{type}"
		if @typeColours.hasOwnProperty(key)
			return [@typeColours[key]..., alpha]
		else 
			colour = colours[@lastColourUsed] 
			@lastColourUsed += 1
			if @lastColourUsed == colours.length
				@lastColourUsed = 0

			@typeColours[key] = colour

			return [colour..., alpha]


window.AnnotationTypeColourMap = AnnotationTypeColourMap