import highland from 'highland';
import afl from 'lib/afl';
import http from 'http';
import url from 'url';

const PORT = 8080;
const NOT_FOUND = 404;

http.createServer((request, response) => {
    const u = url.parse(request.url);
    if (u.pathname === "/afl") {
        response.setHeader("Content-Type", "image/svg+xml");
        const s = unescape(u.query).split("\n");
        highland(s)
            .through(afl)
            .each(r => response.write(r))
            .done(() => response.end());
    } else {
        response.writeHead(NOT_FOUND);
        response.end();
    }
}).listen(PORT);
