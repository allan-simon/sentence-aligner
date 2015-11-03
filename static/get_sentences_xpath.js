var SentencesByStruct = (function () {
'use strict';

var COD_XPATH = '//block[@meta-fonction="COD"]';

/**
 * @param {Element}
 */
var getWithCODNextPage = function(sentencesList) {
    var lastID = getLastID(sentencesList);
    var promise;
    if (lastID === undefined) {
        promise = get(COD_XPATH);
    } else {
        promise = getNextPage(COD_XPATH, lastID);
    }
    promise.then(
        function(sentences) {
            addAllSentencesToList(sentences, sentencesList); 
        }
    );
    return promise;
};

/**
 * @param {Element} sentencesList
 */
var getLastID = function(sentencesList) {
    var lastSentence = sentencesList.lastElementChild;
    if (lastSentence === null) {
        return undefined;
    }
    return lastSentence.dataset.id;
};

/**
 * @param {Array.<Object>}
 * @param {Element}
 */
var addAllSentencesToList = function(sentences, sentencesList) {
    sentences.forEach(
        function(sentence) {

            var li = document.createElement('li');

            var span = document.createElement('span');
            span.appendChild(document.createTextNode(sentence.content));
            span.setAttribute("data-id", sentence.id);
            span.setAttribute("data-structure", sentence.structure);

            span.onmouseleave = function () {
                var selection = window.getSelection();
                // Note: at least on firefox, getSelection() always return an object
                if (selection.rangeCount !== 1) {
                    return;
                }
                var range = selection.getRangeAt(0);
                if (
                    !this.contains(range.startContainer) ||
                    !this.contains(range.endContainer)
                ) {
                    return;
                }

                var selectedText = range.toString();
                this.setAttribute("data-selection", selectedText);

            }.bind(span);

            li.appendChild(span);

            var showLink = document.createElement("a");
            showLink.appendChild(document.createTextNode(" [Show]"));
            showLink.href = "show_sentence.html?id=" + sentence.id;
            li.appendChild(showLink);


            var checkCOD = document.createElement("a");
            checkCOD.appendChild(document.createTextNode(" [Check]"));
            checkCOD.onclick = checkRangeIs.bind(
                checkRangeIs,
                'block[meta-fonction=COD]',
                span,
                li
            );
            li.appendChild(checkCOD);

            sentencesList.appendChild(li);

        }
    );
};

/**
 *
 * @param {String}  query
 * @param {Element} sentenceSpan
 * @param {Element} li
 *
 */
var checkRangeIs = function(query, sentenceSpan, li) {

    var selectedText = sentenceSpan.dataset.selection;
    if (selectedText === undefined) {
        return;
    }
    var structure = sentenceSpan.dataset.structure;

    var tmp = document.createElement("tmp");
    tmp.innerHTML = structure;
    var results = Array.from(tmp.querySelectorAll(query));
    
    var found = results.reduce(
        function(foundYet, block) {
            return foundYet || block.textContent === selectedText;
        },
        false
    );

    Array.from(li.querySelectorAll(".result")).forEach(
        function(resultText) { resultText.remove();}
    );
    var span = document.createElement("span");
    span.classList.add("result");
    
    var text = document.createTextNode("try again");
    if (found) {
        text = document.createTextNode("ok");
    }
    span.appendChild(text);
    li.appendChild(span);
};

/**
 * @param {String}
 *
 * @return {Promise}
 */
var get = function(xpath) {
    //TODO: encode URL param
    return Async.get('/sentences?xpath='+xpath);
};

/**
 * @param {String}
 * @param {String}
 *
 * @return {Promise}
 */
var getNextPage = function(xpath, fromID) {
    //TODO: encode URL param
    return Async.get('/sentences?xpath='+xpath+"&from_id="+fromID);
};

return {
    getWithCODNextPage: getWithCODNextPage
};

}());
