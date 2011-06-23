define('rhinautheros.jquery', ['rhinautheros', 'jQuery'], function(rhino, $) {
    // function signedXHR(options, originalOptions, jqXHR) {
    //     return {
    //         send: function(headers, completeCallback) {

    //             [> completeCallback(status, statusText, responses, headers); <]
    //         },
    //         abort: function() {
    //         }
    //     };
    // }

    function signXHR(options, originalOptions, jqXHR) {
        var auth, body;

        if (options.oauth) {
            body = options.type == 'GET' ? '' : options.data;
            auth = rhino.authorization(options.type, options.url, body);

            options.headers.Authorization = auth;
        }
    }

    $.ajaxPrefilter(signXHR);
});
