define('rhinautheros', ['jsSHA', 'url'], function(jsSHA, URL) {
    var accessToken = {
        access_token: 'not secret',
        token_type: 'mac',
        expires_in: 3600,
        refresh_token: 'another secret',
        mac_key: 'secret',
        mac_algorithm: 'hmac-sha-256',
        issue_time: 2359082350
    };

    /**
     * Returns a string identifier of the specific hash algorithm to use
     * based on the mac_algorithm property of the access token.
     */
    function hashAlgorithm() {
        var matches = accessToken.mac_algorithm.match(/(sha-\d+)/i);
        return matches[1].toUpperCase();
    }

    /**
     * Returns a hash of the given string using Base64 encoding.  The
     * hash algorithm used is determined by details of the access token
     * provided by the server.
     */
    function hash(text) {
        var shaObj = new jsSHA(text, 'ASCII');
        return shaObj.getHash(hashAlgorithm(), 'B64');
    }

    function hmac(text) {
        var shaObj = new jsSHA(text, 'ASCII');
        return shaObj.getHMAC(accessToken.access_token, 'ASCII', hashAlgorithm(), 'B64');
    }

    function getNonce() {
        var age = Math.round((new Date() - new Date(accessToken.issue_time)) / 1000)
          , random = Math.round(Math.random() * 99999999);

        return String(age) +':'+ String(random);
    }

    function normalizedRequestString(nonce, method, url, bodyhash, ext) {
        var location = URL.parse(url);

        return [
            nonce,
            method.toUpperCase(),
            location.pathname + location.search,
            location.host,
            location.port,
            bodyhash,
            ext || ""
        ].map(function(e) {
            return e + "\n";
        }).join("");
    }

    return {
        /**
         * Returns a string that should be set as the value of the
         * Authorization header on a request.
         */
        authorization: function(method, url, body, ext) {
            var nonce = getNonce()
              , bodyhash = body ? hash(body) : ""
              , requestString = normalizedRequestString(nonce, method, url, bodyhash, ext)
              , mac = hmac(requestString);

            var params = [
                ['id', accessToken.access_token],
                ['nonce', nonce],
                ['bodyhash', bodyhash],
                ['mac', mac],
                ['ext', ext]
            ];
            
            return "MAC "+ params.filter(function(param) {
                return !!param[1];  // filter out bodyhash and ext if they are empty
            }).map(function(param) {
                return param[0] +'="'+ param[1] +'"';
            }).join(',');
        }
    };
});
