const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8080;
const PUBLIC_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

// Mirror production (Cloudflare serves gzip'd text assets) so local
// Lighthouse runs are comparable to live numbers — without this the
// uncompressed ~1.5MB JS payload inflates throttled mobile transfer by ~5s.
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.txt', '.xml', '.svg']);

function sendFile(req, res, filePath, ext, stats) {
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  // Mirror production (Cloudflare: max-age=0 + must-revalidate + ETag/304)
  const etag = '"' + require('crypto').createHash('md5').update(filePath + stats.size + stats.mtimeMs).digest('hex') + '"';
  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Accept-Encoding',
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'ETag': etag
  };
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, headers);
    res.end();
    return;
  }
  const acceptsGzip = /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
  if (COMPRESSIBLE.has(ext) && acceptsGzip) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If it's a static file request with extension (like .js, .css, .png), return 404
      const ext = path.extname(reqPath).toLowerCase();
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      // SPA Fallback: Serve index.html for clean routes (e.g. /financial, /calc/loan-calculator)
      sendFile(req, res, path.join(PUBLIC_DIR, 'index.html'), '.html', stats || { size: 0, mtimeMs: 0 });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    sendFile(req, res, filePath, ext, stats);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
