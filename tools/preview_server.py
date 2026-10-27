#!/usr/bin/env python3
"""Serve the built site (_site/) the way GitHub Pages does, for previews.

    python3 tools/preview_server.py            # then open http://localhost:4000/personal-blog/

Pages are served under /personal-blog/, folders serve their index.html,
and missing addresses get 404.html with a 404 status.
"""
import http.server
import os
import sys
import urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "_site")
PREFIX = "/personal-blog"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4000


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path == PREFIX:
            return self.redirect(PREFIX + "/")
        if not path.startswith(PREFIX + "/"):
            return self.serve(os.path.join(ROOT, "404.html"), 404)
        full = os.path.join(ROOT, urllib.parse.unquote(path[len(PREFIX):]).lstrip("/"))
        if os.path.isdir(full):
            if not path.endswith("/"):
                return self.redirect(path + "/")
            full = os.path.join(full, "index.html")
        if not os.path.isfile(full):
            return self.serve(os.path.join(ROOT, "404.html"), 404)
        self.serve(full, 200)

    def redirect(self, location):
        self.send_response(301)
        self.send_header("Location", location)
        self.end_headers()

    def serve(self, filename, code):
        with open(filename, "rb") as fh:
            data = fh.read()
        self.send_response(code)
        self.send_header("Content-Type", self.guess_type(filename))
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    print(f"Serving _site at http://localhost:{PORT}{PREFIX}/  (Ctrl+C to stop)")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
