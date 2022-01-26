const { parse } = require("querystring");

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.product_name);
  output = output.replace(/{%IMAGE%}/g, product.product_img_src);
  output = output.replace(/{%DESCRIPTION%}/g, product.product_description);
  output = output.replace(/{%NUTRIENTS%}/g, product.product_nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.product_quantity);
  output = output.replace(/{%PRICE%}/g, product.product_price);
  output = output.replace(/{%ID%}/g, product.product_id);

  return output;
};

module.exports = {
  replaceTemplate,
  collectRequestData,
};
