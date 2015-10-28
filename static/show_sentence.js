var ShowSentence = (function () {

'use strict';


var load = function (id, sentenceDiv) {
    Async.get('/sentences/' + id)
        .then(
            function(sentence) {
                sentenceDiv.innerHTML = sentence.content;
            }
        )
        .catch(function() { sentenceDiv.innerHTML = 'Error';})
    ;
};

/**
 * @param {string}  id
 * @param {Element} sentenceDiv
 */
var loadStructure = function (id, sentenceDiv) {
    return Async.get('/sentences/' + id)
        .then(
            function(sentence) {
                if (sentence.structure === undefined) {
                    sentenceDiv.appendChild(document.createTextNode(sentence.content));
                    return;
                }
                var parser = new window.DOMParser();
                var sourceXML = parser.parseFromString(sentence.structure, "text/xml");
                Converter.createHTMLFromXML(
                    sourceXML.documentElement,
                    sentenceDiv
                );

            }
        )
        .catch(function() { sentenceDiv.innerHTML = 'Error';})
    ;
};

return {
    load: load,
    loadStructure: loadStructure
};

} ());
