// server.js — Servidor local OPCIONAL para qr-entrada.
// Uso:  npm run dev   →  http://localhost:7777 (abre el navegador solo).
//
// La página también funciona SIN servidor: doble clic en index.html.
// Este script solo sirve por si preferís la modalidad "npm run dev".
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 7777;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const rel = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
    const file = path.normalize(path.join(__dirname, rel));
    if (!file.startsWith(path.normalize(__dirname))) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('404');
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`QR de entrada → ${url}   (Ctrl+C para cerrar)`);
    if (!process.env.NO_OPEN) exec(`start "" "${url}"`); // abre el navegador
  });
