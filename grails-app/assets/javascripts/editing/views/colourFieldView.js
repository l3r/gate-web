"use strict";
var targets_1 = require("../targets");
var span_1 = require("../data/span");
var ColourFieldView = (function () {
    /*
      Encapsulates the generation of the required DOM objects to show overlapping annotations
    */
    function ColourFieldView(text, colourField) {
        // Construct a bitmap representing each character with a different colour
        this.colourField = colourField;
        this.viewer = $(targets_1.Targets.getInstance().textField);
        this.spans = new Array();
        this.text = text;
    }
    ColourFieldView.prototype.updateAnnotations = function () {
        // Just regenerate everything
        this.colourField.update();
        this.spans = this.generateSpansInRange();
        return this.update(this.renderSpans(this.spans));
    };
    ColourFieldView.prototype.invalidate = function (left, right) {
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
        new_spans = new_spans.map(function (span) { return span.node; });
        old_spans = old_spans.map(function (span) { return span.node; });
        $(old_spans).first().before(new_spans);
        return $(old_spans).remove();
    };
    /**
     * Discovers each contiguous colour block in range and builds a span for it.
     * @param start Where to start
     * @param end Where to end
     * @returns {Array<Span>}
     */
    ColourFieldView.prototype.generateSpansInRange = function (start, end) {
        if (start === void 0) { start = null; }
        if (end === void 0) { end = null; }
        var annotations, colour, lastAnnotations, lastColour, lastOffset, spans;
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
                spans.push(new span_1.Span(lastOffset, i - 1, lastColour, lastAnnotations));
                lastColour = colour;
                lastOffset = i;
                lastAnnotations = annotations;
            }
        }
        spans.push(new span_1.Span(lastOffset, end, lastColour, lastAnnotations));
        return spans;
    };
    /**
     * Finds spans that are touching the given range. Useful for updating without updating everything.
     * @param start
     * @param end
     * @returns {any}
     */
    ColourFieldView.prototype.findSpanRange = function (start, end) {
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
            }
            else {
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
    };
    ColourFieldView.prototype.addNewLines = function (text) {
        return text.split("\n").join("<br>");
    };
    /**
     * Returns the specified spans as nodes in the document.
     * @param spans Which spans to place. We don't assume the whole document wants updating as this would be expensive.
     * @returns {any}
     */
    ColourFieldView.prototype.renderSpans = function (spans) {
        var _this = this;
        var result = new Array();
        spans.forEach(function (span) {
            // Construct a node for the annotation.
            var text = _this.text.slice(span.start, span.end + 1);
            var textNodes = $.parseHTML(_this.addNewLines(text));
            var hasAnnotations = !jQuery.isEmptyObject(span.annotations);
            var colour = span.colour;
            var spanNode = $("<span data-has-annotations='" + hasAnnotations + "' data-offset='" + span.start + "'>").append(textNodes).get(0);
            if (hasAnnotations) {
                spanNode.style["background-color"] = colour.rgbString;
            }
            span = $.extend({}, span, {
                node: spanNode
            });
            _this.attachEvents(span);
            return result.push(span);
        });
        return result;
    };
    ColourFieldView.prototype.attachEvents = function (span) {
        var _this = this;
        return $(span.node).on("mouseover", null, span, function (event) { return _this.showSpan(event.data); });
    };
    ColourFieldView.prototype.showSpan = function (span) {
        var annotation, annotationId, text, _ref;
        text = "";
        _ref = span.annotations;
        for (annotationId in _ref) {
            annotation = _ref[annotationId];
            text += annotation.type + "<br />";
        }
        return $("#annotationInfo").html(text);
    };
    ColourFieldView.prototype.deleteSpan = function (span) {
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
    };
    ColourFieldView.prototype.update = function (spans) {
        var nodes;
        nodes = spans.map(function (span) { return span.node; });
        this.viewer.empty();
        return this.viewer.append(nodes);
    };
    ColourFieldView.prototype.removeAnnotation = function (annotation) {
        // First, remove the annotation from the annotations list
        var left, right;
        //this.annotationSets[annotation.type] = this.annotationSets[annotation.type].filter((ann) => ann !== annotation);
        left = annotation.indices[0];
        right = annotation.indices[1];
        // Update the colour field
        return this.invalidate(left, right);
    };
    return ColourFieldView;
}());
exports.ColourFieldView = ColourFieldView;
