const http = require('http');
const { URL } = require('url');

const routes = require('./routes');
const bodyParser = require('./helpers/bodyParser');

const server = http.createServer((request, response) => {

  // Parse da URL, para extrair os query parms
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  // Verificar se existe um parametro ID no final da URL
  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  } else {
    // Remove a barra ('/') do final da string se tiver a barra
    pathname = pathname.endsWith('/') ? pathname.slice(0, pathname.length - 1) : pathname;
  }

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`)

  // Encontrar a rota pelo endpoint e metodo
  const route = routes.find((routeObj) => {
    return (
      routeObj.endpoint === pathname && routeObj.method === request.method
    );
  });


  if(route) { 
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };
    

    // Criacao do response.send para facilitar o codigo/pattern
    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-type': 'application/json'});
      response.end(JSON.stringify(body));
    };

    // Verificando o metedo de requisicao/transformando as informacoes em strings
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response)
    }
  } else {
    response.writeHead(404, { 'Content-type': 'text/html'});
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  };
});

server.listen(3000,() => console.log('🔥 Server started at http://localhost:3000'));