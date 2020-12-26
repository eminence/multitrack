#!/usr/bin/env python3

import http.server
import socketserver

PORT = 8083

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map[".wasm"] = "application/wasm"

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port http://127.0.0.1:%d" % (PORT, ))
    httpd.serve_forever()