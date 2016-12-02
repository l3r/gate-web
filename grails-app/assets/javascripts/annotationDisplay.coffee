

class AnnotationDisplay
  ###
    Encapsulates the generation of the required DOM objects to show overlapping annotations
  ###
  constructor: (@target, @document) ->
    # Construct a bitmap representing each character with a different colour
    @colourField = []
    @annotationsAt = []

    @viewer = null
    @spans = []

    @setDocument(@document)

  setDocument: (@document) ->
    @colourField = [0..@document.text.length].map -> [255,255,255, 1]
    @annotationsAt = [0..@document.text.length].map -> {}

    $(@document).on("visibleAnnotations:changed", @updateAnnotations.bind(this))
    @typeColours = {}
    @updateAnnotations()

  updateAnnotations: () ->
    # Just regenerate everything
    @updateColourField()
    @spans = @generateSpansInRange()
    @spans = @renderSpans(@spans, @document.text)

    @update()

      
  combineAlpha: (a, b) ->
    ### Combines two colours, appying alpha channel ###
    out = [0,0,0,0]
    alpha = a[3] + b[3]*(1-a[3])
    out[3] = alpha
    for c in [0,1,2]
      out[c] = Math.floor((a[c]*a[3]+b[c]*b[3]*(1-a[3]))/alpha)
    return out
  
  updateColourField: (start = null, end = null) -> # TODO: Limit this to a certain range if possible
    @colourField = [0..@document.text.length].map -> [255,255,255, 0]
    @annotationsAt = [0..@document.text.length].map -> {}

    ### Calculates the colours at each offset in the document ###
    for annotation in @document.getVisibleAnnotations() 
      for offset in [annotation.startOffset..(annotation.endOffset-1)]
        @colourField[offset] = @combineAlpha(annotation.colour, @colourField[offset])
        @annotationsAt[offset][annotation.id] = annotation

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
      if !_.isEqual(lastAnnotations, annotations)
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


  renderSpans: (spans) ->
    ### Converts the specified spans to nodes in the document

    Returns a copy of the spans with the nodes attached as a field###
    result = []

    for span in spans
      # Construct a node for the annotation.
      text = @document.text[span.start..span.end]

      textNodes = $.parseHTML(@addNewLines(text))
      hasAnnotations = !jQuery.isEmptyObject(span.annotations)
      
      colour = span.colour
      spanNode = $("<span data-has-annotations='#{hasAnnotations}' data-offset='#{span.start}'>").append(textNodes).get(0)

      if hasAnnotations
        spanNode.style["background-color"] = @document.makeColourString(colour)
      span = $.extend({}, span, {node: spanNode});

      @attachEvents(span)
      result.push(span)

    return result

  attachEvents: (span) ->
    $(span.node).on "mouseover", null, span, (event) => 
      @showSpan(event.data)
 

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

window.AnnotationDisplay = AnnotationDisplay

