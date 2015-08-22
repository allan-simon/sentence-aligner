var EditSentence = (function() {


var load = function(id, form) {
    Async.get('/sentences/' + id)
        .then(
            function(sentence) {
                form.edit_content.value = sentence.content;
                form.edit_lang.value = sentence.lang;
            }
        )
        .catch(console.warn.bind(console))
    ;
}

var submit = function (id, form, resultDiv) {

    var formData = {
        'lang' : form.edit_lang.value,
        'content' : form.edit_content.value
    };

    Async.patch('/sentences/' + id, formData)
        .then(
            function(sentence) {
                message = "OK";
                if (sentence.id !== id) {
                    message = "It would create a duplicate";
                }
                resultDiv.innerHTML = (
                    message +
                    "<a href='/static/show_sentence.html?id=" + sentence.id + "'>" +
                    "show" +
                    "</a>"
                );
            }
        )
        .catch(function () { resultDiv.innerHTML = "Error"; })
    ;
}

return {
    load: load,
    submit: submit
}

}());
