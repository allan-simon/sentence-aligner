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
                 * @param {Array.<Object>} translations
                 */
                function(translations) {
                    translations.forEach(
                        /**
                         * @param {Object}
                         */
                        function(oneTranslation) {
                            var li = document.createElement("li");

                            var sentenceSpan = document.createElement("span");
                            var text = document.createTextNode(oneTranslation.content);
                            sentenceSpan.appendChild(text);
                            li.appendChild(sentenceSpan);

                            var show = document.createElement("a");
                            show.href = "show_sentence.html?id=" + oneTranslation.id;
                            show.appendChild(document.createTextNode("show"));
                            li.appendChild(show);

                            var align = document.createElement("a");
                            align.href = "align_sentences.html" +
                                "?destination_id=" + oneTranslation.id +
                                "&source_id=" + id
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
