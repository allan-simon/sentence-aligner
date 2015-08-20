var ShowSentence = (function () {
    'use strict';


    var load = function (id, sentenceDiv) {
        var request = new XMLHttpRequest();
        request.open('GET', '/sentences/' + id, true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function () {
            if (request.status !== 200) {
                console.warn("not 200");
                sentenceDiv.innerHTML = "Error"
                return;
            }
            var sentence = JSON.parse(request.responseText)
            sentenceDiv.innerHTML = sentence['content']

        }

        request.send();
    }

    return {
        load: load
    }
} ());
