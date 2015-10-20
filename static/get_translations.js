var GetTranslations = (function () {
    'use strict';


    /**
     * @param {string} id
     * @param {Element} translationsUL
     */
    var load = function (id, translationsUL) {
        Async.get('/sentences/' + id + '/translations/sentences')
            .then(
                /**
                 * @param {Object.<string, <Object>>} translations
                 */
                function(translations) {
                    var translationsIDs = Object.keys(translations);
                    translationsIDs.forEach(
                        /**
                         * @param {String}
                         */
                        function(translationID) {
                            /** @type {Object} */
                            var sentenceDest = translations[translationID];

                            var li = document.createElement("li");

                            var sentenceSpan = document.createElement("span");
                            var text = document.createTextNode(sentenceDest.content);
                            sentenceSpan.appendChild(text);
                            li.appendChild(sentenceSpan);

                            var show = document.createElement("a");
                            show.href = "show_sentence.html?id=" + sentenceDest.id;
                            show.appendChild(document.createTextNode("show"));
                            li.appendChild(show);

                            var align = document.createElement("a");
                            align.href = "align_sentences.html" +
                                "?destination_id=" + sentenceDest.id +
                                "&source_id=" + id +
                                "&translation_id=" + translationID
                            ;
                            align.appendChild(document.createTextNode("align"));
                            li.appendChild(align);

                            translationsUL.appendChild(li);
                        }
                    );
                    console.log(translations);
                }
            )
            .catch(function() { translationsUL.innerHTML = 'Error';})
        ;
    };

    return {
        load: load
    };
} ());
