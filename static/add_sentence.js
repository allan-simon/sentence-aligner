var Add = (function() {
'use strict';


var submit = function (form, resultDiv) {

    var formData = {
        'lang' : form.lang.value,
        'content' : form.content.value
    };

    Async.post('/sentences', formData)
        .then(
            function(sentence) {
                resultDiv.innerHTML = (
                    "OK" +
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
    submit: submit
};

}());




