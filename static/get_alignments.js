var GetAlignments = (function () {
'use strict';

/**
 * Get the alignments from translation identified by translationID
 * and load the two parts respectively in sourceElement, and destElement
 * it returns a promise, so that event can be chained
 *
 * @param {string}  translationID
 * @param {Element} sourceElement
 * @param {Element} destElement
 *
 * @return {Promise}
 * @public
 */
var get = function(translationID, sourceElement, destElement) {

    return Async.get('/translations/' + translationID )
        .then(
            function(translation) {
                var parser = new window.DOMParser();
                var sourceXML = parser.parseFromString(translation.alignment_source, "text/xml");
                Converter.createHTMLFromXML(
                    sourceXML.documentElement,
                    sourceElement
                );

                var destXML = parser.parseFromString(translation.alignment_dest, "text/xml");
                Converter.createHTMLFromXML(
                    destXML.documentElement,
                    destElement
                );
            }
        )
        .catch(function() { sourceElement.innerHTML = 'Error';})
    ;

};





return {
    get: get
};

}());


