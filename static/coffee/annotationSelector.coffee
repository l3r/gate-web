class AnnotationSelector
    ### Shows a control to allow the user to select which annotation sets are displayed ###
    constructor: (@target) ->
        @viewer = null
        @selected = []

    show: (@annotationSets) ->
        @update()
        @updateSelection()

    update: () ->
        annotationSelections = $.parseHTML("<form></form>")
        for annotationSet, annotations of @annotationSets 
            entry = $.parseHTML(
                "<label style='color: #{@viewer.annotationDisplay.makeColourString(@viewer.annotationDisplay.getTypeColour(annotationSet, 1))}'>
                    <input type='checkbox' name='annotations' value='#{annotationSet}'> #{annotationSet}</label><br>")

            if annotationSet in @selected
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
        @viewer.showAnnotationSets(annotationSets)    
