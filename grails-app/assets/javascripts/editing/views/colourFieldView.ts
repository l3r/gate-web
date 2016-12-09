///<reference path="../../lib/underscore.d.ts"/>
import {Document} from "../data/document";
import {Targets} from "../targets";
import {Span} from "../data/span";
import {Annotation} from "../data/annotation";
import {Colour} from "../data/colour";
import {ColourField} from "../data/colourField";


export class ColourFieldView {
    private colourField : ColourField;
    private viewer : JQuery;
    private spans : Array<Span>;
    private jquerySpans;

    private text;

    /*
      Encapsulates the generation of the required DOM objects to show overlapping annotations
    */
    constructor(text : string, colourField : ColourField) {
        // Construct a bitmap representing each character with a different colour
        this.colourField = colourField;
        this.viewer = $(Targets.getInstance().textField);
        this.spans = new Array<Span>();
        this.text = text;
    }


    public updateAnnotations() {
        // Just regenerate everything
        this.colourField.update();

        this.spans = this.generateSpansInRange();

        return this.update(this.renderSpans(this.spans));
    }

    public invalidate(left, right) {
        var new_spans, old_spans, span_range, _ref;
        this.colourField.update();

        // Find our spans that the annotation covers
        span_range = this.findSpanRange(left, right);

        // REnder spans in the range that we're about to remove.
        // This is not the same as the range covered by the annotation, as the annotation may be
        // adjacent to others of the same colour
        new_spans = this.renderSpans(this.generateSpansInRange(this.spans[span_range[0]].start, this.spans[span_range[1]].end));

        old_spans = this.spans.slice(span_range[0], +span_range[1] + 1 || 9e9);

        // Replace the spans in our internal datastructure
        [].splice.apply(this.spans, [(_ref = span_range[0]), span_range[1] - _ref + 1].concat(new_spans)), new_spans;

        // And replace them in the DOM
        new_spans = new_spans.map((span) => span.node);
        old_spans = old_spans.map((span) => span.node);

        $(old_spans).first().before(new_spans);
        return $(old_spans).remove();
    }

    /**
     * Discovers each contiguous colour block in range and builds a span for it.
     * @param start Where to start
     * @param end Where to end
     * @returns {Array<Span>}
     */
    public generateSpansInRange(start : number = null, end : number = null) : Array<Span> {
        var annotations : Array<Annotation>, colour : Colour, lastAnnotations : Array<Annotation>,
            lastColour : Colour, lastOffset : number, spans : Array<Span>;
        start = start === null ? 0 : start;
        end = end === null ? this.text.length - 1 : end;

        lastOffset = start;
        lastColour = this.colourField.get(lastOffset);
        lastAnnotations = this.colourField.getAnnotations(lastOffset);
        spans = [];
        for (var i = start; i < end; i++) {
            colour = this.colourField.get(i);
            annotations = this.colourField.getAnnotations(i);
            if (!_.isEqual(lastAnnotations, annotations)) {
                spans.push(new Span(lastOffset, i - 1, lastColour, lastAnnotations));

                lastColour = colour;
                lastOffset = i;
                lastAnnotations = annotations;
            }
        }

        spans.push(new Span(lastOffset, end, lastColour, lastAnnotations));

        return spans;
    }

    /**
     * Finds spans that are touching the given range. Useful for updating without updating everything.
     * @param start
     * @param end
     * @returns {any}
     */
    public findSpanRange(start, end) : Array<Span> {
        var left, mid, right;
        if (this.spans === []) {
            return [];
        }

        // First find the first node.
        left = 0;
        right = this.spans.length - 1;
        mid = Math.floor((left + right) / 2);
        while (!(this.spans[mid].start >= start && this.spans[mid].start <= end) && left <= right) {
            if (this.spans[mid].start < start) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
            mid = Math.floor((left + right) / 2);
        }

        // Now search left until we see something that doesn't work.
        left = mid;
        right = mid;
        while ((left > 0) && (this.spans[left - 1].end >= start)) {
            left -= 1;
        }

        while ((right < this.spans.length - 1) && (this.spans[right + 1].start <= end)) {
            right += 1;
        }

        return [left, right];
    }

    public addNewLines(text) {
        return text.split("\n").join("<br>");
    }

    /**
     * Returns the specified spans as nodes in the document.
     * @param spans Which spans to place. We don't assume the whole document wants updating as this would be expensive.
     * @returns {any}
     */
    public renderSpans(spans : Array<Span>)  {
        var result = new Array();
        spans.forEach((span) => {
            // Construct a node for the annotation.
            var text : string = this.text.slice(span.start, span.end + 1);

            var textNodes = $.parseHTML(this.addNewLines(text));
            var hasAnnotations = !jQuery.isEmptyObject(span.annotations);

            var colour = span.colour;
            var spanNode = $("<span data-has-annotations='" + hasAnnotations + "' data-offset='" + span.start + "'>").append(textNodes).get(0);

            if (hasAnnotations) {
                spanNode.style["background-color"] = colour.rgbString;
            }
            span = $.extend({}, span, {
                node: spanNode
            });

            this.attachEvents(span);
            return result.push(span);
        });

        return result;
    }

    public attachEvents(span) {
        return $(span.node).on("mouseover", null, span, (event) => this.showSpan(event.data));
    }

    public showSpan(span) {
        var annotation, annotationId, text, _ref;
        text = "";
        _ref = span.annotations;
        for (annotationId in _ref) {
            annotation = _ref[annotationId];
            text += annotation.type + "<br />";
        }
        return $("#annotationInfo").html(text);
    }

    public deleteSpan(span) {
        var annotation, annotationId, _ref, _results;
        _ref = span.annotations;
        _results = [];
        for (annotationId in _ref) {
            annotation = _ref[annotationId];
            // Remove one annotation from this position.
            this.removeAnnotation(annotation);
            break;
        }
        return _results;
    }

    public update(spans) {
        var nodes;
        nodes = spans.map((span) => span.node);
        this.viewer.empty();
        return this.viewer.append(nodes);
    }

    public removeAnnotation(annotation) {
        // First, remove the annotation from the annotations list
        var left, right;
        //this.annotationSets[annotation.type] = this.annotationSets[annotation.type].filter((ann) => ann !== annotation);

        left = annotation.indices[0];
        right = annotation.indices[1];
        // Update the colour field
        return this.invalidate(left, right);
    }
}
