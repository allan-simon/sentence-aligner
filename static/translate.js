var Translate = (function() {
'use strict';


var submit = function (sourceId, form)  {

    var formData = {
        'lang' : form.lang.value,
        'content' : form.content.value
    };
    Async.post('/sentences', formData)
        .then(
            function(sentence) {
                var translationData = {
                    source_id : sourceId,
                    dest_id : sentence.id
                };
                return Async.post('/translations', translationData);
            }
        ).then(function(translation) { console.log(translation) }
        ).catch(function () { console.log("woot")})
    ;
};

return {
    submit: submit
};

}());

