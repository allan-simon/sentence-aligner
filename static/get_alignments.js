var GetAlignments = (function () {
'use strict';

/**
 * @param {string}  translationID
 * @param {Element} sourceElement
 * @param {Element} destElement
 *
 * @public
 */
var get = function(translationID, sourceElement, destElement) {

    Async.get('/translations/' + translationID )
        .then(
            function(translation) {
                var parser = new window.DOMParser();
                var sourceXML = parser.parseFromString(translation.alignment_source, "text/xml");
                createHTMLFromXML(sourceXML.documentElement, sourceElement);
                
                var destXML = parser.parseFromString(translation.alignment_dest, "text/xml");
                createHTMLFromXML(destXML.documentElement, destElement);
            }
        )
        .catch(function() { sourceElement.innerHTML = 'Error';})
    ;

};

/**
 * TODO: can certainly be factorized with createXmlFromSpan
 *
 * @param {Element} xmlBlock
 * @param {Element} htmlBlock
 *
 * @return {Element}
 */
var createHTMLFromXML = function(xmlBlock, htmlBlock) {
    var nodes = xmlBlock.childNodes;

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.tagName === undefined) {
            var textNode = document.createTextNode(node.textContent);
            htmlBlock.appendChild(textNode);
            continue;
        }
        var span = document.createElement("span");
        span = attributeToDataset(span, node.attributes);
        span = createHTMLFromXML(node, span);
        htmlBlock.appendChild(span);
    }
    return htmlBlock;
};

/**
 * @param {Element}     span
 * @param {NamedNodeMap} attributes
 *
 * @return {Element}
 */
var attributeToDataset = function(span, attributes) {
    if (attributes === undefined) {
        return span;     
    } 

    var keys = Object.keys(attributes);
    keys.forEach(
        function(oneKey) {
            var oneAttribute = attributes[oneKey];
            span.setAttribute("data-"+oneAttribute.nodeName, oneAttribute.textContent);
        }
    );
    return span;
};

return {
    get: get   
};

}());


