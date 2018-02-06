let messages = [];
let routes = ['/classes/messages'];
var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  /////////Defined return object////////////
  let returnObj = {};
  /////////Return Object properties////////
  returnObj.headers = request.headers;
  returnObj.method = request.method;
  returnObj.url = request.url;
  ///////Get Request Body//////////
  let body = [];
  request.on('error', (err)=> {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    returnObj.body = body;
    response.on('error', (err) => {
      console.error(err);
    });
    //////////Functions for when request is done//////////
    let statusCode;

    if (returnObj.method === 'POST') {
      statusCode = 201;
      messages.push(JSON.parse(body));
    } else if (returnObj.method === 'GET') {
      statusCode = 200;
    }
    if (!routes.includes(returnObj.url)) {
      statusCode = 404;
    }
    returnObj.results = messages;
    const headersReq = defaultCorsHeaders;
    headersReq['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headersReq);
    response.write(JSON.stringify(returnObj));
    response.end()

  })
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
