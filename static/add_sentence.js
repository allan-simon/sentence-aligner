var Add = (function() {
'use strict';


var submit = function (form, resultDiv) {

    var formData = {
        'lang' : form.lang.value,
        'content' : form.content.value
    };

    var request = new XMLHttpRequest();
    request.open('POST', '/sentences', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status !== 200) {
            console.warn("not 200");
            return;
        }
        var sentence = JSON.parse(request.responseText)
        resultDiv.innerHTML = "OK <a href='/static/show_sentence?id=" + sentence['id'] + "'>show</a>";

    }
    request.onerror = function () {
        resultDiv.innerHTML = "Error"
    }

    request.send(JSON.stringify(formData));
}


return {
    submit: submit
};

}());




