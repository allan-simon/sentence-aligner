var AlignSentences = (function () {
'use strict';

/**
 * @param {String}  translationID
 * @param {Element} source
 * @param {Element} destination
 */
var save = function(translationID, source, destination) {

    var xmlSource = document.createElement("sentence");
    xmlSource = createXmlFromSpan(source, xmlSource);

    var xmlDestination = document.createElement("sentence");
    xmlDestination = createXmlFromSpan(destination, xmlDestination);

    var formData = {
        'alignment_dest' : xmlDestination.outerHTML,
        'alignment_source' : xmlSource.outerHTML
    };

    Async.put('/translations/'+translationID+"/alignments", formData)
        .then(function(x) {

            console.log(x);
        })
        .catch(function() {console.error("error");})
    ;



};

/**
 * @param {Element} span
 * @param {Element} xmlSource
 *
 * @return {Element}
 */
var createXmlFromSpan = function (span, xmlSource) {
    var nodes = span.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.tagName === undefined) {
            var textNode = document.createTextNode(node.textContent);
            xmlSource.appendChild(textNode);
            continue;
        }
        var block = document.createElement("block");
        block = datasetToAttributes(block, node.dataset);
        block = createXmlFromSpan(node, block);
        xmlSource.appendChild(block);
    }

    return xmlSource;
};

/**
 * @param {Element} block
 * @param {DOMStringMap} dataset TODO or undefined
 */
var datasetToAttributes = function(block, dataset) {
    if (dataset === undefined) {
        return block;
    }

    var keys = Object.keys(dataset);
    keys.forEach(
        function (oneKey) {
            block.setAttribute(oneKey, dataset[oneKey]);
        }
    );
    return block;
};


return {
    save: save
};

}());

