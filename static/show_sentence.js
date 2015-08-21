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
    }

    return {
        load: load
    }
} ());
