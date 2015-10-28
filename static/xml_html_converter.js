var Converter = (function () {
'use strict';

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

/**
 * @param {Element} span
 * @param {Element} xmlSource
 *
 * @return {Element}
 */
var createXMLFromHTML = function (span, xmlSource) {
    var nodes = span.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.tagName === undefined) {
            var textNode = document.createTextNode(node.textContent);
            xmlSource.appendChild(textNode);
            continue;
        }
        var block = document.createElement("block");
        block = dataAttributesToXMLAttributes(block, node.attributes);
        block = createXMLFromHTML(node, block);
        xmlSource.appendChild(block);
    }

    return xmlSource;
};

/**
 * @param {Element} block
 * @param {NamedNodeMap} attributesMap
 */
var dataAttributesToXMLAttributes = function(block, attributesMap) {
    if (attributesMap === undefined) {
        return block;
    }

    var attributes = Array.from(attributesMap);
    var dataAttributes = attributes.filter(
        function(oneAttribute) {
            return oneAttribute.nodeName.startsWith("data-");
        }
    );
    dataAttributes.forEach(
        function (dataAttribute) {
            block.setAttribute(
                dataAttribute.nodeName.substr("data-".length),
                dataAttribute.value
            );
        }
    );
    return block;
};

return {
    createHTMLFromXML: createHTMLFromXML,
    createXMLFromHTML: createXMLFromHTML
};

}());

