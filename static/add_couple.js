var AddCouple = (function() {
'use strict';

/**
 *
 */
var display_message = function (div, message) {
    div.innerHTML = message
};

/**
 *
 */
var submit = function (form, resultDiv) {


    var sourceData = {
        'lang' : form.source_lang.value,
        'content' : form.source_content.value
    };

    var destData = {
        'lang' : form.dest_lang.value,
        'content' : form.dest_content.value
    };

    Promise.all(
        [
            Async.post('/sentences', sourceData),
            Async.post('/sentences', destData)
        ]
    ).then(
        function(values){
            return Async.post(
                '/translations',
                {
                    source_id: values[0].id,
                    dest_id: values[1].id
                }
            );
        }
    ).then(display_message.bind(undefined, resultDiv, 'OK'))
    .catch(display_message.bind(undefined, resultDiv, 'Error'))
}

return {
    submit: submit
};

}());

