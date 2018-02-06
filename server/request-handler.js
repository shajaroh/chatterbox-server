let messages = [];
let routes = ['/classes/messages','/','/classes/room'];
var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  let returnObj = {};
  let statusCode = 200;
  returnObj.headers = request.headers;
  returnObj.method = request.method;
  returnObj.url = request.url;

  if (request.method === 'POST') {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    });
    request.on('end', () => {
      body = body.reduce((a, e) => { return a + e}, '');
      console.log(body);
      statusCode = 201;
      if (!routes.includes(returnObj.url)) {
        statusCode = 404;
      }
      let parsed = JSON.parse(body);
      parsed.objectId = messages.length + 1;
      messages.push(parsed);
      returnObj.results = messages;
      response.writeHead(statusCode, responseHeaders);
      response.end(JSON.stringify(returnObj));
    });
  }

  if (request.method === 'GET') {
      if (!routes.includes(returnObj.url)) {
        statusCode = 404;
      }
      returnObj.results = messages;
      response.writeHead(statusCode, responseHeaders);
      response.end(JSON.stringify(returnObj));
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, responseHeaders);
    response.end();
  }

};

var responseHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};

exports.requestHandler = requestHandler;
