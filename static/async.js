var Async = (function () {
'use strict';

    var encodeUrlParams = function (url, args) {
        var uri = url;
        uri += '?';
        var argcount = 0;
        for (var key in args) {
            if (!args.hasOwnProperty(key)) { continue; }

            if (argcount++) {
                uri += '&';
            }
            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
        }
    }

    // Method that performs the ajax request
    var ajax = function (method, uri, data) {
        // Creating a promise
        var promise = new Promise(
            function (resolve, reject) {
                // Instantiates the XMLHttpRequest

                var client = new XMLHttpRequest();
                client.open(method, uri);
                client.setRequestHeader('Content-Type', 'application/json');
                client.send(JSON.stringify(data));

                client.onload = function () {
                    // we use 303 in case of duplicate content
                    if (this.status === 200 || this.status === 201 || this.status === 303) {
                        resolve(JSON.parse(this.response));
                    } else {
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            }
        );

        // Return the promise
        return promise;
    };

    return {
        'get' : function(url, args) {
            var uri = (
                args
                ? encodeUrlParams(url, args)
                : url
            );
            return ajax('GET', uri);
        },
        'post' : function(url, data) {
            return ajax('POST', url, data);
        },
        'put' : function(url, data) {
          return ajax('PUT', url, data);
        },
        'delete' : function(url) {
            return ajax('DELETE', url);
        }
    };
}());
