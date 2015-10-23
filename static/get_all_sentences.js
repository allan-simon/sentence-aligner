var AllSentences = (function () {
'use strict';

/**
 * @return {Element}
 *
 * @return {Promise}
 */
var get = function(sentencesList) {

    return Async.get('/sentences')
        .then(addAllSentencesToList.bind(undefined, sentencesList))
        .catch(function() {
            var errorLi = document.createElement('li');
            errorLi.appendChild(document.createTextNode("Error"));
            sentencesList.appendChild(errorLi);
        })
    ;
};

/**
 * @param {Element}
 *
 * @return {Promise}
 *
 * @public
 */
var getNextPage = function(sentencesList) {

    var lastSentence = sentencesList.lastChild;
    if (lastSentence === undefined) {
        return get(sentencesList);
    }
    var id = lastSentence.dataset.id;

    return Async.get('/sentences?from_id='+id)
        .then(addAllSentencesToList.bind(undefined, sentencesList))
    ;
};


/**
 * @param {Element}
 * @param {Array}
 *
 * @private
 */
var addAllSentencesToList = function(sentencesList, sentences) {
    sentences.forEach(
        addSentenceToList.bind(undefined, sentencesList)
    );
};

/**
 * @param {Element}
 * @param {Sentence}
 *
 * @private
 */
var addSentenceToList = function(sentencesList, sentence) {
    var li = document.createElement('li');

    li.appendChild(document.createTextNode(sentence.content));
    li.setAttribute("data-id", sentence.id);

    var showLink = document.createElement("a");
    showLink.appendChild(document.createTextNode(" [Show]"));
    showLink.href = "show_sentence.html?id=" + sentence.id;
    li.appendChild(showLink);

    sentencesList.appendChild(li);
};

return {
    get: get,
    getNextPage: getNextPage
};

}());
