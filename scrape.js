const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const twilioSid = process.env.TWILIO_SID;
const twilioAuth = process.env.TWILIO_AUTH;

const client = require("twilio")(twilioSid, twilioAuth);

const handle = setInterval(scrape, 20000);

const url =
  "https://www.amazon.in/Oneplus-Bluetooth-Truly-Wireless-Earbuds/dp/B07XW7X1X6/ref=sr_1_3?crid=GDOGM2CXLM3Z&keywords=oneplus%2Bbuds%2Bpro&qid=1656403607&sprefix=oneplus%2Bbuds%2Bpr%2Caps%2C602&sr=8-3&th=1";

const product = { name: "", price: "", link: "" };

async function scrape() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const item = $("div#dp-container");

  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;

  if (priceNum < 90000) {
    client.messages
      .create({
        body: ` The Price of ${product.name} is reduced to ${priceNum} click on ${product.link}`,
        from: "+19895147354",
        to: "+919099022373",
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

scrape();
