var AllSentences = (function () {
'use strict';

/**
 * @return {Element}
 *
 * @return {Promise}
 */
var get = function(sentencesList) {

    return Async.get('/sentences')
        .then(
            /**
             * @param {Array}
             */
            function(sentences) {
                console.log(sentences);
                sentences.forEach(function(sentence) {
                    var li = document.createElement('li');

                    li.appendChild(document.createTextNode(sentence.content));

                    var showLink = document.createElement("a");
                    showLink.appendChild(document.createTextNode(" [Show]"));
                    showLink.href = "show_sentence.html?id=" + sentence.id;
                    li.appendChild(showLink);

                    sentencesList.appendChild(li);
                });
            }
        )
        .catch(function() {
            var errorLi = document.createElement('li');
            errorLi.appendChild(document.createTextNode("Error"));
            sentencesList.appendChild(errorLi);
        })
    ;
};

return {
    get: get
};

}());
