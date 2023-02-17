/**
 * Body Parser Helper
 * @param request Request Object provided by main function
 * @param callback Function to be executed by the route
 */
function bodyParser(request, callback) {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    body = JSON.parse(body);
    request.body = body;
    callback();
  });
}

module.exports = bodyParser;