define('url', function() {
    var ports = {
        'http:': '80',
        'https:': '443'
    };

    function parse(url) {
        var link = document.createElement('a'), port;
        link.href = url;

        port = link.port == "0" ? ports[link.protocol] : link.port;

        return {
            href: link.href,  // fully-resolved URL
            protocol: link.protocol,
            host: link.host,  // includes port
            hostname: link.hostname,  // authority without authentication info or port
            port: port,
            pathname: link.pathname,  // path without query string or hash
            search: link.search,  // A.K.A. query string
            hash: link.hash
        };
    }

    return {
        parse: parse
    };
});
