# https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md D3 category 20
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


class AnnotationDisplay
  ###
    Encapsulates the generation of the required DOM objects to show overlapping annotations
  ###
  constructor: (@target) ->
    # Construct a bitmap representing each character with a different colour
    @colourField = []
    @annotationsAt = []

    @viewer = null
    @typeColours = {}
    @spans = []

  setDocument: (@text, @annotationSets) ->
    @colourField = [0..@text.length].map -> [255,255,255, 1]
    @annotationsAt = [0..@text.length].map -> {}

    @typeColours = {}
    @setAnnotations(@annotationSets)

  setAnnotations: (@annotationSets) ->
    # Just regenerate everything
    @updateColourField()
    @spans = @generateSpansInRange()
    @spans = @renderSpans(@spans, @text)

    @update()

  getTypeColour: (type, alpha=0.3) ->
    ### 
      Generates a colour for the given type, or retrieves it if there already is one.
    ###

    if @typeColours.hasOwnProperty(type)
      return [@typeColours[type]..., alpha]
    else 
      colour = colours[lastColourUsed]
      lastColourUsed += 1
      if lastColourUsed == colours.length
        lastColourUsed = 0

      @typeColours[type] = colour

      return [colour..., alpha]
      
  combineAlpha: (a, b) ->
    ### Combines two colours, appying alpha channel ###
    out = [0,0,0,0]
    alpha = a[3] + b[3]*(1-a[3])
    out[3] = alpha
    for c in [0,1,2]
      out[c] = Math.floor((a[c]*a[3]+b[c]*b[3]*(1-a[3]))/alpha)
    return out
  
  updateColourField: (start = null, end = null) -> # TODO: Limit this to a certain range if possible
    @colourField = [0..@text.length].map -> [255,255,255, 0]
    @annotationsAt = [0..@text.length].map -> {}

    ### Calculates the colours at each offset in the document ###
    for type, annotations of @annotationSets 
      typeColour = @getTypeColour(type)
      for index, annotation of annotations
        annotation.type = type
        for offset in [annotation.indices[0]..annotation.indices[1]]
          @colourField[offset] = @combineAlpha(typeColour, @colourField[offset])
          @annotationsAt[offset][annotation.annotationID] = annotation

  invalidate: (left, right) ->
    @updateColourField(left, right)

    # Find our spans that the annotation covers
    span_range = @findSpanRange(left, right)

    # REnder spans in the range that we're about to remove.
    # This is not the same as the range covered by the annotation, as the annotation may be
    # adjacent to others of the same colour
    new_spans = @renderSpans(@generateSpansInRange(@spans[span_range[0]].start, @spans[span_range[1]].end))

    old_spans = @spans[span_range[0]..span_range[1]]

    # Replace the spans in our internal datastructure
    @spans[span_range[0]..span_range[1]] = new_spans

    # And replace them in the DOM
    new_spans = (span.node for span in new_spans)
    old_spans = (span.node for span in old_spans)

    $(old_spans).first().before(new_spans)
    $(old_spans).remove()

  generateSpansInRange: (start = null, end = null) ->
    ### Returns the ranges for each colour area ###
    start = if start == null then 0 else start
    end = if end == null then @colourField.length-1 else end
    
    lastOffset = start
    lastColour = @colourField[lastOffset]
    lastAnnotations = @annotationsAt[lastOffset]
    spans = []
    for offset in [start..end]
      colour = @colourField[offset]
      annotations = @annotationsAt[offset]
      if !Object.equal(lastAnnotations, annotations)
        spans.push {
          start: lastOffset
          end: offset-1
          colour: lastColour
          annotations: lastAnnotations
        }
        lastColour = colour
        lastOffset = offset
        lastAnnotations = @annotationsAt[offset]

    spans.push {
        start: lastOffset
        end: end
        colour: lastColour
        annotations: @annotationsAt[end-1]
      }

    return spans

  findSpanRange: (start, end) ->
    ### Performs a search to find the spans that are within the given range ###
    if @spans == []
      return []
      
    # First find the first node.
    left = 0
    right = @spans.length - 1
    mid = Math.floor((left + right) / 2) 
    while !(@spans[mid].start >= start and @spans[mid].start <= end) and left <= right
      if @spans[mid].start < start
        left = mid + 1
      else 
        right = mid - 1
      mid = Math.floor((left + right) / 2) 

    # Now search left until we see something that doesn't work.
    left = mid
    right = mid
    while (left > 0) and (@spans[left-1].end >= start)
      left -= 1

    while (right < @spans.length - 1) and (@spans[right+1].start <= end)
      right += 1

    return [left, right]

  addNewLines: (text) ->
    text.split("\n").join("<br>")

  makeColourString: (colour) ->
    "rgba(#{Math.floor(colour[0])}, #{Math.floor(colour[1])}, #{Math.floor(colour[2])}, #{colour[3]})"

  renderSpans: (spans) ->
    ### Converts the specified spans to nodes in the document

    Returns a copy of the spans with the nodes attached as a field###
    result = []

    for span in spans
      # Construct a node for the annotation.
      text = @text[span.start..span.end]

      textNodes = $.parseHTML(@addNewLines(text))
      
      spanNode = $("<span data-offset='#{span.start}'>").append(textNodes).get(0)
      colour = span.colour

      if colour != null
        spanNode.style["background-color"] = @makeColourString(colour)
      span = $.extend({}, span, {node: spanNode});

      @attachEvents(span)
      result.push(span)

    return result

  attachEvents: (span) ->
    $(span.node).on "mouseover", null, span, (event) => 
      @showSpan(event.data)
    $(span.node).on "click", null, span, (event) =>
    	for annotationId, annotation of span.annotations
    		@viewer.showAnnotation annotation
    		break


  showSpan: (span) ->
    text = ""
    for annotationId, annotation of span.annotations
      text += "#{annotation.type}<br />"
    $("#annotationInfo").html(text)
 
  deleteSpan: (span) ->
    for annotationId, annotation of span.annotations 
      # Remove one annotation from this position.
      @removeAnnotation(annotation)
      break

  update: ->
    nodes = (span.node for span in @spans)
    @target.empty()
    @target.append(nodes)

  removeAnnotation: (annotation) ->
    # First, remove the annotation from the annotations list
    @annotationSets[annotation.type] = @annotationSets[annotation.type].filter (ann) -> ann isnt annotation

    left = annotation.indices[0]
    right = annotation.indices[1]
    # Update the colour field
    @invalidate(left, right)



