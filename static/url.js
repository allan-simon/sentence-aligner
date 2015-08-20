var UrlUtils = (function () {
    'use strict';

    var getUrlParameter = function (name) {
        name = RegExp(
            '[?&]' + // a url param is always started by a & or ?
            name.replace(/([[\]])/, '\\$1') +
            '=([^&#]*)' // match the value part
        );

        return (
            window.location.href.match(name) ||
            []
        )[1];
        
    }

    return {
        getUrlParameter: getUrlParameter
    }

}());
