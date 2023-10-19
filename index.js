const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');
//const replaceTemplate = require('./replaceTemplate');


/////+++++++++++++++++/////
app
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
//console.log(slugify('Avocados', { lower: true }));

const app = http.createServer((req, res) => {
  //console.log(req.url);
  //console.log(url.parse(req.url, true));
  //res.end('Hello from the server');
  const { query, pathname } = url.parse(req.url, true);
  //const pathName = req.url;

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    //console.log(cardsHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    //res.end(tempOverview);

    //Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API
  } else if (pathname === '/api') {
    //fs.readFile(`${__dirname}/data.json`, 'utf-8', (err, data) => {
    //    const productData = JSON.parse(data);
    //    console.log(productData);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
    //});

    //res.end('API');

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>page not found</h1>');
  }
});

//
// server.listen(8000, '127.0.0.1', () => {
//   console.log('listening to request on port 8000');
// });
