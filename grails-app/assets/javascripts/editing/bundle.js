define("endpoints", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This should be initialised by setting the endpoints using Grails' URL generation.
     *
     * Created by Dominic Rout on 09/12/2016.
     */
    var Endpoints = (function () {
        function Endpoints() {
        }
        Endpoints.getInstance = function () {
            return Endpoints._instance;
        };
        Endpoints._instance = new Endpoints();
        return Endpoints;
    }());
    exports.Endpoints = Endpoints;
});
define("targets", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * This should be initialised by setting the endpoints using Grails' URL generation.
     *
     * Created by Dominic Rout on 09/12/2016.
     */
    var Targets = (function () {
        function Targets() {
        }
        Targets.getInstance = function () {
            return Targets._instance;
        };
        Targets._instance = new Targets();
        return Targets;
    }());
    exports.Targets = Targets;
});
define("data/colour", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents an RGBA colour with methods for mixing and comparison
     *
     * Created by Dominic Rout on 09/12/2016.
     */
    var Colour = (function () {
        function Colour(r, g, b, a) {
            this._r = Math.floor(r);
            this._g = Math.floor(g);
            this._b = Math.floor(b);
            this._a = a;
        }
        Colour.fromRGB = function (colour) {
            return new Colour(colour[0], colour[1], colour[2], 1);
        };
        Colour.prototype.withAlpha = function (a) {
            return new Colour(this._r, this._g, this._b, a);
        };
        Object.defineProperty(Colour.prototype, "r", {
            get: function () {
                return this._r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "g", {
            get: function () {
                return this._g;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "b", {
            get: function () {
                return this._b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "a", {
            get: function () {
                return this._a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "rgbString", {
            get: function () {
                return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
            },
            enumerable: true,
            configurable: true
        });
        Colour.prototype.combineAlpha = function (other) {
            /* Combines two colours, appying alpha channel*/
            var r, g, b, alpha;
            alpha = this.a + other.a * (1 - this.a);
            r = Math.floor((other.r * this.a + other.r * other.a * (1 - this.a)) / alpha);
            g = Math.floor((other.g * this.a + other.g * other.a * (1 - this.a)) / alpha);
            b = Math.floor((other.b * this.a + other.b * other.a * (1 - this.a)) / alpha);
            return new Colour(r, g, b, alpha);
        };
        Colour.prototype.equals = function (other) {
            return this.r == other.r &&
                this.g == other.g &&
                this.b == other.b &&
                this.a == other.a;
        };
        Colour.prototype.toString = function () {
            return this.rgbString;
        };
        return Colour;
    }());
    exports.Colour = Colour;
});
/**
 * Created by Dominic Rout on 09/12/2016.
 */
define("data/annotation", ["require", "exports"], function (require, exports) {
    "use strict";
    var Annotation = (function () {
        function Annotation(set, type, startOffset, endOffset, id, features) {
            if (features === void 0) { features = null; }
            this._type = type;
            this._set = set;
            this._startOffset = startOffset;
            this._endOffset = endOffset;
            this._id = id;
            this._features = features;
        }
        Annotation.fromJSON = function (json) {
            return new Annotation(json.set, json.type, json.startOffset, json.endOffset, json.id, json.features);
        };
        Object.defineProperty(Annotation.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Annotation.prototype, "set", {
            get: function () {
                return this._set;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Annotation.prototype, "startOffset", {
            get: function () {
                return this._startOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Annotation.prototype, "endOffset", {
            get: function () {
                return this._endOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Annotation.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Annotation.prototype, "features", {
            get: function () {
                return this._features;
            },
            enumerable: true,
            configurable: true
        });
        return Annotation;
    }());
    exports.Annotation = Annotation;
});
///<reference path="../../lib/core-js.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
define("data/annotationSets", ["require", "exports", "data/colour", "data/annotation"], function (require, exports, colour_1, annotation_1) {
    "use strict";
    var colours;
    colours = [[31, 119, 180], [174, 199, 232], [255, 127, 14], [255, 187, 120], [44, 160, 44], [152, 223, 138],
        [214, 39, 40], [255, 152, 150], [148, 103, 189], [197, 176, 213], [140, 86, 75], [196, 156, 148],
        [227, 119, 194], [247, 182, 210], [127, 127, 127], [199, 199, 199], [188, 189, 34],
        [219, 219, 141], [23, 190, 207], [158, 218, 229]];
    /**
     * Stores the map of annotation sets onto types plus their colours.
     */
    var AnnotationSets = (function () {
        function AnnotationSets() {
            this.lastColourUsed = 0;
            this.typeColours = new Map();
            this._annotations = new Map();
            this.isVisible = new Map();
        }
        /**
         * Reads the collection of annotations from a JSON data structure.
         * @param json
         */
        AnnotationSets.fromJson = function (json) {
            var result = new AnnotationSets();
            for (var annotationSet in json) {
                for (var annotationType in json[annotationSet]) {
                    for (var _i = 0, _a = json[annotationSet][annotationType]; _i < _a.length; _i++) {
                        var annotation = _a[_i];
                        result.addAnnotation(new annotation_1.Annotation(annotationSet, annotationType, annotation.startOffset, annotation.endOffset, annotation.id));
                    }
                }
            }
            return result;
        };
        /**
         * Generates a colour for the given type, or retrieves it if there already is one.
         * @param annotationSet Annotation Sert of interest.
         * @param type Annotation Type of interest
         * @param alpha
         * @returns {string|T[]|any|number[]}
         */
        AnnotationSets.prototype.typeColour = function (annotationSet, type, alpha) {
            if (alpha === void 0) { alpha = 0.3; }
            var colour;
            if (this.typeColours.has(annotationSet) &&
                this.typeColours.get(annotationSet).has(type)) {
                return this.typeColours.get(annotationSet).get(type).withAlpha(alpha);
            }
            else {
                // Get the next colour to use.
                colour = colour_1.Colour.fromRGB(colours[this.lastColourUsed]);
                this.lastColourUsed += 1;
                if (this.lastColourUsed === colours.length) {
                    this.lastColourUsed = 0;
                }
                if (!this.typeColours.has(annotationSet)) {
                    this.typeColours.set(annotationSet, new Map());
                }
                this.typeColours.get(annotationSet).set(type, colour);
                return colour;
            }
        };
        AnnotationSets.prototype.isAnnotationVisible = function (annotationSet, annotationType) {
            return this.isVisible.has(annotationSet)
                && this.isVisible.get(annotationSet).has(annotationType)
                && this.isVisible.get(annotationSet).get(annotationType) == true;
        };
        Object.defineProperty(AnnotationSets.prototype, "visibleAnnotations", {
            /**
             * Produces a flat list of annotations that should be displayed in the document.
             * @returns {any}
             */
            get: function () {
                var _this = this;
                var result = new Array();
                this.isVisible.forEach(function (annotationTypes, annotationSet) {
                    annotationTypes.forEach(function (visible, annotationType) {
                        if (visible) {
                            // Add all the annotations from this set/type.
                            _this._annotations.get(annotationSet).get(annotationType).forEach(function (annotation) {
                                result.push(annotation);
                            });
                        }
                    });
                });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnnotationSets.prototype, "annotations", {
            get: function () {
                return this._annotations;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Displays the specified annotation sets. All other annotation sets will be hidden.
         * @param annotationSetType a list of tuples containing the annotation set followed by the annotation type.
         * @returns {Object}
         */
        AnnotationSets.prototype.showAnnotations = function (annotationSetType) {
            var _this = this;
            this.isVisible = new Map();
            annotationSetType.forEach(function (_a) {
                var annotationSet = _a[0], annotationType = _a[1];
                if (!_this.isVisible.has(annotationSet)) {
                    _this.isVisible.set(annotationSet, new Map());
                }
                _this.isVisible.get(annotationSet).set(annotationType, true);
            });
            // Trigger an event so that the colourField knows to update itself.
            $(this).triggerHandler("visible:changed");
        };
        AnnotationSets.prototype.addAnnotation = function (annotation) {
            if (!this._annotations.has(annotation.set)) {
                this._annotations.set(annotation.set, new Map());
            }
            if (!this._annotations.get(annotation.set).has(annotation.type)) {
                this._annotations.get(annotation.set).set(annotation.type, new Array());
            }
            this._annotations.get(annotation.set).get(annotation.type).push(annotation);
            this.showAnnotations([[annotation.set, annotation.type]]);
            $(this).triggerHandler("all:changed", { start: annotation.startOffset, end: annotation.endOffset });
            $(this).triggerHandler("visible:changed", { start: annotation.startOffset, end: annotation.endOffset });
            return annotation;
        };
        AnnotationSets.prototype.removeAnnotation = function (annotation) {
            if (this._annotations.has(annotation.set)) {
                if (this._annotations.get(annotation.set).has(annotation.type)) {
                    var siblings = this._annotations.get(annotation.set).get(annotation.type);
                    for (var i = 0; i < siblings.length; i++) {
                        if (siblings[i].id == annotation.id) {
                            siblings.splice(i, 1);
                        }
                    }
                }
            }
            $(this).triggerHandler("all:changed", { start: annotation.startOffset, end: annotation.endOffset });
            $(this).triggerHandler("visible:changed", { start: annotation.startOffset, end: annotation.endOffset });
        };
        return AnnotationSets;
    }());
    exports.AnnotationSets = AnnotationSets;
});
/*
//	Encodes the colour values at each position of the document text.
*/
define("data/colourField", ["require", "exports", "data/colour", "jquery"], function (require, exports, colour_2, $) {
    "use strict";
    var ColourField = (function () {
        function ColourField(length, annotationSets) {
            var _this = this;
            this.annotationSets = annotationSets;
            this.colourField = new Array(length);
            this.colourField.fill(new colour_2.Colour(255, 255, 255, 0));
            this.annotationsAt = new Array(length);
            this.annotationsAt.fill([]);
            $(annotationSets).on("visible:changed", function (event, data) {
                console.log("visible:changed", data);
                if (data) {
                    _this.update(data.start, data.end);
                }
                else {
                    _this.update();
                }
            });
            this.update();
        }
        ColourField.prototype.update = function (start, end) {
            var _this = this;
            if (start === void 0) { start = null; }
            if (end === void 0) { end = null; }
            if (start == null) {
                start = 0;
            }
            if (end == null) {
                end = this.colourField.length;
            }
            var visible = this.annotationSets.visibleAnnotations;
            // First, reset the colour field and annotations lists.
            for (var i = start; i < end; i++) {
                this.colourField[i] = new colour_2.Colour(255, 255, 255, 0);
                this.annotationsAt[i] = [];
            }
            // Fill in the colour for each individual annotation.
            visible.forEach(function (annotation) {
                var startOffset = annotation.startOffset;
                var endOffset = annotation.endOffset;
                // Only fill annotations within the specified range. Search is currently very slow. Sort the annotations?
                if (startOffset < end && endOffset > start) {
                    "";
                    startOffset = Math.max(startOffset, start);
                    endOffset = Math.min(endOffset, end);
                    for (var i = startOffset; i < endOffset; i++) {
                        var annotationColour = _this.annotationSets.typeColour(annotation.set, annotation.type);
                        _this.colourField[i] = _this.colourField[i].combineAlpha(annotationColour);
                        _this.annotationsAt[i].push(annotation);
                    }
                }
            });
            $(this).triggerHandler("changed", { start: start, end: end });
        };
        ColourField.prototype.get = function (offset) {
            return this.colourField[offset];
        };
        ColourField.prototype.getAnnotations = function (offset) {
            return this.annotationsAt[offset];
        };
        return ColourField;
    }());
    exports.ColourField = ColourField;
});
define("data/document", ["require", "exports", "jquery", "endpoints", "data/annotationSets", "data/colourField"], function (require, exports, $, endpoints_1, annotationSets_1, colourField_1) {
    "use strict";
    /**
     * Brings together all data for the document, including its text, annotation sets, and colour field.
     */
    var Document = (function () {
        function Document(data) {
            // $(this).on("annotations:changed", () => $(this).triggerHandler("visibleAnnotations:changed"));
            this._id = data.id;
            this._text = data.text;
            this._name = data.name;
            this._annotationSets = annotationSets_1.AnnotationSets.fromJson(data.annotationSets);
            this._colourField = new colourField_1.ColourField(this._text.length, this._annotationSets);
        }
        // Goes to the required endpoint and fetches a document, returning it to callback.
        Document.fromId = function (id, callback) {
            var endpoints = endpoints_1.Endpoints.getInstance();
            $.getJSON(endpoints.getDocumentAnnotations, { "id": id }, function (data) {
                callback(new Document(data));
            });
        };
        Object.defineProperty(Document.prototype, "colourField", {
            get: function () {
                return this._colourField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Document.prototype, "annotationSets", {
            get: function () {
                return this._annotationSets;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Document.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Document.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Document.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        return Document;
    }());
    exports.Document = Document;
});
define("data/span", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Contains enough data to construct a span over a section of text in the field viewer.
     *
     * Created by Dominic Rout on 09/12/2016.
     */
    var Span = (function () {
        function Span(start, end, colour, annotations) {
            this._start = start;
            this._end = end;
            this._colour = colour;
            this._annotations = annotations;
        }
        Object.defineProperty(Span.prototype, "start", {
            get: function () {
                return this._start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Span.prototype, "end", {
            get: function () {
                return this._end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Span.prototype, "colour", {
            get: function () {
                return this._colour;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Span.prototype, "annotations", {
            get: function () {
                return this._annotations;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Span.prototype, "node", {
            get: function () {
                return this._node;
            },
            set: function (value) {
                this._node = value;
            },
            enumerable: true,
            configurable: true
        });
        return Span;
    }());
    exports.Span = Span;
});
define("views/colourFieldView", ["require", "exports", "underscore", "jquery", "data/span"], function (require, exports, _, $, span_1) {
    "use strict";
    var ColourFieldView = (function () {
        /*
          Encapsulates the generation of the required DOM objects to show overlapping annotations
        */
        function ColourFieldView(text, colourField, target) {
            var _this = this;
            // Construct a bitmap representing each character with a different colour
            this.colourField = colourField;
            this.viewer = $(target);
            this.spans = new Array();
            this.text = text;
            $(this.colourField).on("changed", function (event, data) {
                if (data) {
                    _this.invalidate(data.start, data.end);
                }
                else {
                    _this.updateAnnotations();
                }
            });
        }
        ColourFieldView.create = function (document, target) {
            var result = new ColourFieldView(document.text, document.colourField, target);
            result.updateAnnotations();
            return result;
        };
        ColourFieldView.prototype.updateAnnotations = function () {
            // Just regenerate everything
            this.spans = this.generateSpansInRange();
            this.renderSpans(this.spans);
            return this.update();
        };
        ColourFieldView.prototype.invalidate = function (left, right) {
            if (left === void 0) { left = null; }
            if (right === void 0) { right = null; }
            var new_spans, old_spans, span_range, _ref;
            //this.colourField.update();
            console.log(left, right);
            if (left == null || right == null) {
                return this.updateAnnotations();
            }
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
            if (start === void 0) { start = null; }
            if (end === void 0) { end = null; }
            var left, mid, right;
            if (this.spans === []) {
                return [];
            }
            if (start == null || end == null) {
                return this.spans;
            }
            // First find the first node.
            left = 0;
            right = this.spans.length - 1;
            mid = Math.floor((left + right) / 2);
            while (!(this.spans[mid].start >= start && this.spans[mid].start <= end) && left <= right && mid > -1) {
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
                span.node = spanNode;
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
        ColourFieldView.prototype.update = function () {
            var nodes;
            nodes = this.spans.map(function (span) { return span.node; });
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
});
///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../../lib/bootstrap.d.ts"/>
define("views/selector", ["require", "exports"], function (require, exports) {
    "use strict";
    var Selector = (function () {
        function Selector(annotationSets, target) {
            this.annotationSets = annotationSets;
            this.target = $(target);
            $(this.annotationSets).on("all:changed", this.update.bind(this));
        }
        Selector.create = function (document, target) {
            var result = new Selector(document.annotationSets, target);
            result.update();
            result.updateSelection();
            return result;
        };
        Selector.prototype.update = function () {
            var _this = this;
            var annotationType, entry, setAnnotations, typeAnnotations, _ref;
            var annotationSelections = $.parseHTML("<form></form>");
            console.log(this.annotationSets.annotations);
            this.annotationSets.annotations.forEach(function (annotationTypes, annotationSet) {
                $(annotationSelections).append("<h3>" + (annotationSet || "Default Set") + "</h3>");
                annotationTypes.forEach(function (annotations, annotationType) {
                    var colour = _this.annotationSets.typeColour(annotationSet, annotationType, 1);
                    //noinspection CssInvalidPropertyValue
                    var entry = $.parseHTML("<label style='color: " + colour.rgbString + "'>\n                    <input type='checkbox' name='annotations' value='" + annotationSet + ":" + annotationType + "'>\n                    " + annotationType + "</label><br>");
                    // Select this entry in the list if it's supposed to already be visible.
                    if (_this.annotationSets.isAnnotationVisible(annotationSet, annotationType)) {
                        $(entry).find("input:checkbox").attr("checked", "checked");
                    }
                    $(annotationSelections).append(entry);
                });
            });
            $(annotationSelections).find("input:checkbox").on("change", this.updateSelection.bind(this));
            this.target.empty();
            return this.target.append(annotationSelections);
        };
        Selector.prototype.updateSelection = function () {
            var annotationSets;
            annotationSets = [];
            $(this.target).find("input:checked").map(function () {
                return $(this).val();
            }).each(function (index, selection) {
                var splitSelection = selection.split(":");
                annotationSets.push([splitSelection[0], splitSelection[1]]); // Converts to a tuple
            });
            //this.selected = annotationSets;
            return this.annotationSets.showAnnotations(annotationSets);
        };
        return Selector;
    }());
    exports.Selector = Selector;
});
///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../../lib/bootstrap.d.ts"/>
define("views/editor", ["require", "exports", "endpoints", "data/annotation", "bootstrap", "bootstrap-editable"], function (require, exports, endpoints_2, annotation_2) {
    "use strict";
    var Editor = (function () {
        function Editor(target, field, document) {
            var _this = this;
            this.field = field;
            this.target = $(target);
            this.document = document;
            var editor = this;
            this.target.popover({
                selector: "span[data-has-annotations=true]",
                html: true,
                placement: "auto right",
                content: function () {
                    // Generate the HTML to select an annotation
                    var content = editor.generatePopover($(this).data("offset"));
                    console.log(content);
                    return content;
                }
            });
            // Hide all other popovers
            this.target.on("click", "span", function (event) {
                return _this.target.find("span").not(event.currentTarget).popover("hide").next(".popover").remove();
            });
            // this.target.find(".nudgeLeft").on("click", () => this.nudgeAnnotation(-1));
            //
            // this.target.find(".nudgeRight").on("click", () => this.nudgeAnnotation(1));
            //
            // this.target.find(".nudgeLeftEdge").on("click", () => this.nudgeAnnotationEdge(-1));
            //
            // this.target.find(".nudgeRightEdge").on("click", () => this.nudgeAnnotationEdge(1));
            //
            //
            // this.target.find(".deleteAnnotation").on("click", () => this.viewer.annotationDisplay.removeAnnotation(this.annotation));
        }
        Editor.prototype.generatePopover = function (offset) {
            var annotations;
            this.popover = $("<div class='tooltipContainer'><div class=\"content\"></div></div>");
            annotations = this.field.getAnnotations(offset);
            if (annotations.length == 1) {
                this.fetchAndShowAnnotation(annotations[0]);
            }
            else {
                this.showAnnotationMenu(annotations);
            }
            return this.popover[0];
        };
        Editor.prototype.showAnnotationMenu = function (annotations) {
            var _this = this;
            var selector = $.parseHTML("\n        <div class='annotationSelector'>\n            <h2>Please select an annotation to view</h2>\n            <div class='annotationList list-group\"'></div>\n        </div>\n        ");
            var list = $(selector).find(".annotationList");
            for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
                var annotation = annotations_1[_i];
                var annotationDOM = $("<a href='#' class=\"list-group-item\">" + annotation.set + ":" + annotation.type + "</a>");
                annotationDOM.on("click", annotation, function (event) {
                    console.log(event);
                    _this.fetchAndShowAnnotation(event.data);
                });
                list.append(annotationDOM);
            }
            $(this.popover).children().replaceWith(list);
        };
        Editor.prototype.fetchAndShowAnnotation = function (annotation) {
            var _this = this;
            return $.getJSON(endpoints_2.Endpoints.getInstance().getAnnotation, {
                documentId: this.document.id,
                annotationSet: annotation.set,
                id: annotation.id
            }, function (data) { return _this.showAnnotationDetails(annotation_2.Annotation.fromJSON(data)); });
        };
        Editor.prototype.generateEditableRow = function (featureName, featureValue, annotation) {
            var _this = this;
            var newRow = $("<tr><td><a class='editableName'>" + featureName + "</a></td>\n                        <td><a class='editableValue'>" + featureValue + "</a></td></tr>");
            console.log(annotation);
            newRow.find("a.editableValue").editable({
                type: "text",
                params: {
                    "documentId": this.document.id,
                    "annotationSet": annotation.annotationSet,
                    "annotationId": annotation.id
                },
                pk: 1,
                name: featureName,
                url: endpoints_2.Endpoints.getInstance().saveFeature,
                title: "Enter feature value"
            });
            newRow.find("a.editableName").editable({
                type: "text",
                params: {
                    "documentId": this.document.id,
                    "annotationSet": annotation.set,
                    "annotationId": annotation.id
                },
                pk: 1,
                name: featureName,
                url: endpoints_2.Endpoints.getInstance().saveFeatureName,
                title: "Enter feature name",
                success: function (response, newValue) {
                    newRow.find("a.editableValue").editable("destroy");
                    newRow.find("a.editableValue").editable({
                        type: "text",
                        params: {
                            "documentId": _this.document.id,
                            "annotationSet": annotation.set,
                            "annotationId": annotation.id
                        },
                        pk: 1,
                        name: newValue,
                        url: endpoints_2.Endpoints.getInstance().saveFeature,
                        title: "Enter feature value"
                    });
                    newRow.find("a.editableValue").editable("toggle");
                }
            });
            return newRow;
        };
        Editor.prototype.showAnnotationDetails = function (annotation) {
            var _this = this;
            var result = $("<form class='annotationEditor'>\n            <div class='form-group'>\n                <label for='annotationType'>Annotation Type</label>\n                <input type='text' name='annotationType' value='" + annotation.type + "' />\n            </div>\n            <div class=\"form-group\">\n                <table class='featureTable'>\n                    <tr> \n                    <th>Name</th><th>Value</th>\n                </tr>\n                </table>\n            </div>\n            \n            <input type='button' name='addFeature' value='Add Feature' class='btn btn-default addFeature' />\n            <input type='button' name='removeAnnotation' value='Remove Annotation' class='btn btn-danger removeAnnotation' />\n\n        </form>");
            var table = result.find("table");
            jQuery.each(annotation.features, function (featureName, featureValue) {
                table.append(_this.generateEditableRow(featureName, featureValue, annotation));
            });
            // Add an event for adding a new feature value.
            result.find(".addFeature").on("click", function (e) {
                e.stopImmediatePropagation();
                var newRow = _this.generateEditableRow("", "", annotation);
                table.append(newRow);
                newRow.find("a.editableName").editable("toggle");
            });
            result.find(".removeAnnotation").on("click", function (event) {
                _this.document.annotationSets.removeAnnotation(annotation);
                // TODO: Check success here.
                jQuery.post(endpoints_2.Endpoints.getInstance().removeAnnotation, { documentId: _this.document.id,
                    set: annotation.set,
                    type: annotation.type,
                    id: annotation.id });
                return _this.target.find("span").popover("hide").next(".popover").remove();
            });
            $(this.popover).children().replaceWith(result);
        };
        return Editor;
    }());
    exports.Editor = Editor;
});
/**
 * Created by dominic on 09/12/2016.
 */
define("editing", ["require", "exports", "endpoints", "targets", "data/document", "views/colourFieldView", "views/selector", "views/editor"], function (require, exports, endpoints_3, targets_1, document_1, colourFieldView_1, selector_1, editor_1) {
    "use strict";
    exports.Endpoints = endpoints_3.Endpoints;
    exports.Targets = targets_1.Targets;
    function start(documentID) {
        document_1.Document.fromId(documentID, function (document) {
            console.log(document);
            var colourFieldView = colourFieldView_1.ColourFieldView.create(document, targets_1.Targets.getInstance().textField);
            var annotationSelector = selector_1.Selector.create(document, targets_1.Targets.getInstance().annotationSelector);
            var editor = new editor_1.Editor(targets_1.Targets.getInstance().textField, document.colourField, document);
        });
    }
    exports.start = start;
});
