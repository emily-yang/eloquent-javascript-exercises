// Node exercises can not be ran in the browser,
// but you can look at their solution here.

const { mkdir, rmdir, unlink } = require('fs').promises;

const { createServer } = require('http');

const methods = Object.create(null);

createServer((request, response) => {
  const handler = methods[request.method] || notAllowed;
  handler(request)
    .catch(error => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = 'text/plain' }) => {
      response.writeHead(status, { 'Content-Type': type });
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`,
  };
}

const { createReadStream } = require('fs');
const { stat, readdir } = require('fs').promises;
const mime = require('mime');

methods.GET = async function(request) {
  const path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    else return { status: 404, body: 'File not found' };
  }
  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join('\n') };
  }
  return { body: createReadStream(path), type: mime.getType(path) };
};

const { parse } = require('url');
const { resolve, sep } = require('path');

const baseDirectory = process.cwd();

function urlPath(url) {
  const { pathname } = parse(url);
  const path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: 'Forbidden' };
  }
  return path;
}

methods.DELETE = async function(request) {
  const path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

methods.MKCOL = async function(request) {
  const path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    else {
      await mkdir(path);
      return { status: 204 };
    }
  }
  if (stats.isDirectory()) return { status: 204 };
  return { status: 400 };
};

// methods.MKCOL = function(request) {
//   const path = urlPath(request.url);
//   const statPromise = stat(path);
//   statPromise
//     .then(fileInfo => {
//       if (fileInfo.isDirectory()) return { status: 204 };
//       return { status: 400 };
//     })
//     .catch(err => {
//       if (err.code === 'ENOENT') {
//         Promise.resolve(mkdir(path));
//         return { status: 204 };
//       }
//       throw err;
//     });
// };
