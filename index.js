const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/floor-price/tofu/:projectname", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );
  await page.goto(
    `https://tofunft.com/collection/${req.params.projectname}/items`
  );
  const projectDetail = await page
    .evaluate(() => {
      const price_ = document.querySelector(
        ".chakra-stack.css-1b4dbfl:nth-child(5) div:nth-child(2)"
      ).innerHTML;
      const name_ = document.querySelector(".css-e2is9f").innerText;

      const projectobject = {
        name: name_,
        price: price_,
        c_currency: "bnb",
      };
      return projectobject;
    })
    .catch((err) => res.send(err));
  res.send(projectDetail);
});

app.get("/floor-price/opensea/:projectname", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );
  await page.goto(`https://opensea.io/collection/${req.params.projectname}`);
  const projectDetail = await page
    .evaluate(() => {
      const price_ = document.querySelector(
        ".Blockreact__Block-sc-1xf18x6-0.InfoItemreact__BlockContainer-sc-gubhmc-0.elqhCm.iePaOU:nth-child(3) .Overflowreact__OverflowContainer-sc-7qr9y8-0.jPSCbX"
      ).innerHTML;
      const name_ = document.querySelector(
        ".Blockreact__Block-sc-1xf18x6-0.Flexreact__Flex-sc-1twd32i-0.IgxsY.jYqxGr .Blockreact__Block-sc-1xf18x6-0.Textreact__Text-sc-1w94ul3-0.cojDLS.dgOUEe"
      ).innerHTML;
      const projectobject = {
        name: name_,
        price: price_,
        c_currency: "ethereum",
      };
      return projectobject;
    })
    .catch((err) => res.send("They change format of page"));
  res.send(projectDetail);
});

app.get("/crypto-currency/price/:coin_name", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );
  await page.goto(
    `https://coinmarketcap.com/currencies/${req.params.coin_name}`
  );
  const price = await page
    .evaluate(() => {
      const price_ = document.querySelector(".priceValue span").innerHTML;
      return price_;
    })
    .catch((err) => res.send(err));
  const result = price.slice(1);
  res.send(result);
});

app.get("/fiat-currency/price/:fiat_name", async (req, res) => {
  // 1USD : fiat_name
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );
  await page.goto(
    `https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=${req.params.fiat_name}`
  );
  const price = await page
    .evaluate(() => {
      const price_ = document.querySelector(
        ".result__BigRate-sc-1bsijpp-1.iGrAod"
      ).innerHTML;
      return price_;
    })
    .catch((err) => res.send(err));
  const result = price.slice(0, 5);
  res.send(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening port ${port}...`));
