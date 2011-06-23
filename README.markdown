# rhinautheros

Most web applications use cookies to authenticate the browser session
after the user has logged in.  Cookies suffer from security problems
- in particular, cookie authentication is vulnerable to [cross-site
  request forgery][CSRF].

[CSRF]: http://en.wikipedia.org/wiki/Csrf

Rhinautheros aims to implement 2-legged OAuth for authenticating XHR
requests, thus closing the CSRF hole.

This project is a work in progress.  It is not in a working state yet.

See the talk description, [Cookies are bad for you][cookies] and
[slides][], presented at Open Source Bridge 2011.

[cookies]: http://opensourcebridge.org/sessions/663
[slides]: http://sitr.us/talks/cookies/
