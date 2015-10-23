var AlignSentences = (function () {
'use strict';

/**
 * @param {String}  translationID
 * @param {Element} source
 * @param {Element} destination
 */
var save = function(translationID, source, destination) {

    var xmlSource = document.createElement("sentence");
    xmlSource = Converter.createXMLFromHTML(source, xmlSource);

    var xmlDestination = document.createElement("sentence");
    xmlDestination = Converter.createXMLFromHTML(destination, xmlDestination);

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


return {
    save: save
};

}());

