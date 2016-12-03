class AnnotationSelector
    ### Shows a control to allow the user to select which annotation sets are displayed ###
    constructor: (@target, @document) ->
        @viewer = null

        @show(@document)

        $(@document).on("annotations:changed", @update.bind(this))

    show: (@document) ->
        @update()
        @updateSelection()

    update: () ->
        annotationSelections = $.parseHTML("<form></form>")
        for annotationSet, setAnnotations of @document.annotationSets 
            $(annotationSelections).append("<h3>#{annotationSet || 'Default Set'}</h3>")
            for annotationType, typeAnnotations of setAnnotations
                entry = $.parseHTML(
                    "<label style='color: #{@document.colourMap.makeColourString(@document.annotationTypeColourMap.getTypeColour(annotationSet, annotationType, 1))}'>
                        <input type='checkbox' name='annotations' value='#{annotationSet}:#{annotationType}'> #{annotationType}</label><br>")

                if @document.isAnnotationVisible(annotationSet, annotationType)
                     $(entry).find('input:checkbox').attr("checked", true) 
                $(annotationSelections).append(entry)


        $(annotationSelections).find("input:checkbox").on("change", @updateSelection.bind(this))
        @target.empty()
        @target.append(annotationSelections)


    updateSelection: () ->
        annotationSets = []
        $(@target).find("input:checked").map(() ->
         $(this).val()
         ).each (index, selection) =>
            annotationSets.push(selection)
        @selected = annotationSets
        @document.showAnnotations(annotationSets)    

window.AnnotationSelector = AnnotationSelector