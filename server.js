const http = require("http");
var urlmodule = require("valid-url");
const fs = require("fs");
const querystring = require("querystring");
const mongoose = require("mongoose");

const dbConfig = require("./config/database.config.js");
const { getProducts, addProduct } = require("./controllers/productController");
var { collectRequestData, replaceTemplate } = require("./util/utility");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempAddProduct = fs.readFileSync(
  `${__dirname}/templates/template-addProduct.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}/`);
  //parsing varibles from url
  const query = new URLSearchParams(url.search);
  const pathname = url.pathname;
  //get products
  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    getProducts(req, res)
      .then((products) => {
        const cardHtml = products
          .map((product) => replaceTemplate(tempCard, product))
          .join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
        res.end(output);
      })
      .catch((error) => {
        console.log("error ...");
      });
  }
  // product form template
  else if (pathname === "/add" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(tempAddProduct);
  }
  // add product
  else if (pathname === "/add" && req.method === "POST") {
    collectRequestData(req, (result) => {
      const { product_img_src } = result;
      if (urlmodule.isWebUri(product_img_src)) {
        addProduct(req, res, result);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write("<h3>added Successfully !!</h3>");

        res.end(tempAddProduct);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });

        res.write("<h3>Make sure url is correct</h3>");

        res.end(tempAddProduct);
      }
    });
  } else if (pathname === "/product") {
    getProducts(req, res)
      .then((products) => {
        const productDetailHtml = products
          .map((product) => {
            if (product.product_id === query.get("id"))
              return replaceTemplate(tempProduct, product);
          })
          .join("");

        res.end(productDetailHtml);
      })
      .catch((error) => {
        console.log("error ...");
      });
  } else {
    console.log("page not found");
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1> PAGE NOT FOUND</h1>");
  }
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`server listening on the port ${PORT}`);
});
