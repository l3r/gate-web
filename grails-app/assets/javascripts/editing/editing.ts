/**
 * Created by dominic on 09/12/2016.
 */

import {Endpoints} from "./endpoints";
import {Targets} from "./targets";
import {Document} from "./data/document";
import {ColourFieldView} from "./views/colourFieldView";
import {Selector} from "./views/selector";
import {Editor} from "./views/editor";


export function start(documentID : number) {
    Document.fromId(documentID, (document : Document) => {
        console.log(document);

        var colourFieldView = ColourFieldView.create(document, Targets.getInstance().textField);
        var annotationSelector = Selector.create(document, Targets.getInstance().annotationSelector);
        var editor = new Editor(Targets.getInstance().textField, document.colourField, document);

    });
}

export { Targets, Endpoints };
