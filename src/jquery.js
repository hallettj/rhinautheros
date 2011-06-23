define('injectScript', function() {
    var noop = function() {};

    return function(src, callback) {
        var scripts = document.getElementsByTagName('script')
          , firstScript = scripts[0]
          , head = firstScript.parentNode  // element that contains scripts - not necessarily head tag
          , script = document.createElement('script');

        script.src = src;
        script.onreadystatechange = script.onload = function() {
            if (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onload = script.onreadystatechange = noop;
                head.removeChild(script);

                if (callback) { callback(); }
            }
        };

        head.insertBefore(script, firstScript);
    };
});

define(['injectScript'], function(inject) {
    inject('https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
        // Defines a module that provides jQuery when jQuery is finished
        // loading.
        define('jQuery', function() { return jQuery; });
    });
});
