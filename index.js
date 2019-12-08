require('dotenv').config()
const uuidv1 = require('uuid/v1');
const rp = require('request-promise');
const CryptoJS = require("crypto-js");

const baseURL= 'https://sandbox-api-pay.line.me';
const uri = '/v3/payments/request';

// set timestamp by uuid1
let nonce = uuidv1();
let orderId = 'Line-Pay-v2-test' + nonce;
let body = {
  "amount": 7900,
  "currency": "TWD",
  "orderId": orderId,
  "packages": [
    {
      "id": "1",
      "amount": 7900,
      "products": [
        {
          "id": "AirPods-Pro-001",
          "name": "AirPods Pro",
          "quantity": 1,
          "price": 7900
        }
      ]
    }
  ],
  "redirectUrls": {
    "confirmUrl": "https://pay-store.line.com/order/payment/authorize",
    "cancelUrl": "https://pay-store.line.com/order/payment/cancel"
  }
}

// encrypt body to authorization
let message = process.env.SecretKey + uri + JSON.stringify(body) + nonce;
let hmacString = CryptoJS.HmacSHA256(message, process.env.SecretKey);
let authorization = CryptoJS.enc.Base64.stringify(hmacString);

// set headers
let headers = {
  "Content-Type": "application/json",
  "X-LINE-ChannelId": process.env.ChannelId,
  "X-LINE-Authorization-Nonce": nonce,
  "X-LINE-Authorization": authorization
}

// set request options
let options = {
  uri: baseURL+uri, headers, method: "POST", body: JSON.stringify(body)
}
console.log(options);

// send request
rp(options).then((res) => {
  console.log(res);
}).catch(error => {
  console.log(error);
});
