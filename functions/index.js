const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const moment = require("moment");
admin.initializeApp();
const db = admin.firestore();

exports.openPosition = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const userDataRef = db.collection("users").doc(request.body.localId);
    const amount = request.body.amount;
    const symbol = request.body.symbol;
    const type = request.body.type;
    let securitiesOwned = null;
    let moneyAvailable = null;
    let userData = null;
    let openedAt = null;
    try {
      const userDataResponse = await userDataRef.get();
      userData = userDataResponse.data();
      const symbolInfoResponse = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=672X6GA0BGICYJLF`
      );
      if (!symbolInfoResponse.data["Global Quote"]) {
        return response
          .status(200)
          .json({ message: "No Such Stock in This API", type: "Danger" });
      }
      openedAt = parseFloat(
        parseFloat(symbolInfoResponse.data["Global Quote"]["05. price"])
      );
      securitiesOwned = userData.securitiesOwned;
      moneyAvailable = userData.moneyAvailable;
      if (amount >= moneyAvailable) {
        return response
          .status(200)
          .json({ message: "You Don't Have Enough Money.", type: "Danger" });
      }
      const shares = parseFloat(amount / openedAt);
      moneyAvailable = moneyAvailable - amount;
      securitiesOwned.push({
        symbol,
        openedAt,
        shares,
        currentPrice: 0,
        changeUSD: 0,
        changePercentage: 0,
        type
      });
      await userDataRef.set(
        {
          securitiesOwned,
          moneyAvailable
        },
        { merge: true }
      );
      return response
        .status(200)
        .json({ message: "Position Opened!", type: "Success" });
    } catch (err) {
      return response.status(400).send(err);
    }
  });
});

exports.closePosition = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const userDataRef = db.collection("users").doc(request.body.localId);
    const symbol = request.body.symbol;
    let securitiesOwned = null;
    let moneyAvailable = null;
    let lastRelativePoint = null;
    let gains = null;
    try {
      const userDataResponse = await userDataRef.get();
      const userData = userDataResponse.data();
      securitiesOwned = userData.securitiesOwned;
      moneyAvailable = userData.moneyAvailable;
      lastRelativePoint = userData.lastRelativePoint;

      securitiesOwned.forEach(security => {
        if (security.symbol === symbol) {
          security.type === "short"
            ? (gains = security.openedAt * security.shares + security.changeUSD)
            : (gains = security.currentPrice * security.shares);
        }
      });
      moneyAvailable = parseFloat(moneyAvailable + gains);
      securitiesOwned = securitiesOwned.filter(
        security => security.symbol !== symbol
      );
      if (securitiesOwned.length === 1) {
        lastRelativePoint = moneyAvailable;
      }
      await userDataRef.set(
        {
          securitiesOwned,
          moneyAvailable,
          lastRelativePoint
        },
        { merge: true }
      );
      return response
        .status(200)
        .json({ message: "Position Closed!", type: "Success" });
    } catch (err) {
      return response.status(400).send(err);
    }
  });
});

exports.createUser = functions.auth.user().onCreate(user => {
  const userDataRef = db.collection("users").doc(user.uid);
  return userDataRef.set(
    {
      moneyAvailable: 100000,
      lastRelativePoint: 100000,
      moneyInSecurities: 0,
      securitiesOwned: [],
      portfolioChartData: {
        value: [{ x: moment().unix(), y: 100000 }],
        shortValue: [{ x: moment().unix(), y: 0 }],
        buyValue: [{ x: moment().unix(), y: 0 }]
      }
    },
    { merge: true }
  );
});

exports.deleteUser = functions.auth.user().onDelete(user => {
  const userDataRef = db.collection("users").doc(user.uid);
  return userDataRef.delete();
});

exports.updatePrices = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const userDataRef = db.collection("users").doc(request.body.localId);
    let userData = null;
    let pricesArr = null;
    let securitiesOwned = null;
    let portfolioChartData = null;
    let portfolioCurrentValue = null;
    let portfolioShortCurrentValue = null;
    let portfolioBuyCurrentValue = null;

    try {
      const userDataResponse = await userDataRef.get();
      userData = userDataResponse.data();
      securitiesOwned = userData.securitiesOwned;
      portfolioChartData = userData.portfolioChartData;
      portfolioCurrentValue = userData.moneyAvailable;
      if (securitiesOwned.length === 0) {
        return response
          .status(200)
          .send({ message: "No securities", type: "Danger" });
      }
    } catch (err) {
      return response.status(400).send(err);
    }

    try {
      const symbolsStr = securitiesOwned
        .map(security => security.symbol)
        .join(",");
      const pricesResponse = await axios.get(
        `https://api.iextrading.com/1.0/tops/last?symbols=${symbolsStr}`
      );
      pricesArr = pricesResponse.data;
      response.send;
      if (pricesArr.length > 0) {
        for (let i = 0; i < securitiesOwned.length; i++) {
          const security = securitiesOwned[i];
          security.currentPrice = pricesArr[i].price;
          security.changeUSD = calculateChangeUSD(
            security.openedAt,
            pricesArr[i].price,
            security.type
          );
          security.changePercentage = calculateChangePercentage(
            security.openedAt,
            pricesArr[i].price,
            security.type
          );
          portfolioCurrentValue +=
            security.openedAt * security.shares +
            calculateChangeUSD(
              security.openedAt,
              pricesArr[i].price,
              security.type
            );

          if (security.type === "short") {
            portfolioShortCurrentValue +=
              security.openedAt * security.shares +
              calculateChangeUSD(
                security.openedAt,
                pricesArr[i].price,
                security.type
              );
          }
          if (security.type === "buy") {
            portfolioBuyCurrentValue +=
              security.openedAt * security.shares +
              calculateChangeUSD(
                security.openedAt,
                pricesArr[i].price,
                security.type
              );
          }
        }
        portfolioCurrentValue = Math.round(portfolioCurrentValue);
        portfolioBuyCurrentValue = Math.round(portfolioBuyCurrentValue);
        portfolioShortCurrentValue = Math.round(portfolioShortCurrentValue);
        const arrLength = portfolioChartData.value.length;

        if (
          arrLength >= 1 &&
          moment().unix() - portfolioChartData.value[arrLength - 1].x >= 600
        ) {
          portfolioChartData.value.push({
            x: moment().unix(),
            y: portfolioCurrentValue
          });
          portfolioChartData.shortValue.push({
            x: moment().unix(),
            y: portfolioShortCurrentValue
          });
          portfolioChartData.buyValue.push({
            x: moment().unix(),
            y: portfolioBuyCurrentValue
          });
        }
        if (arrLength === 0) {
          portfolioChartData.value.push({
            x: moment().unix(),
            y: portfolioCurrentValue
          });
          portfolioChartData.shortValue.push({
            x: moment().unix(),
            y: portfolioShortCurrentValue
          });
          portfolioChartData.buyValue.push({
            x: moment().unix(),
            y: portfolioBuyCurrentValue
          });
        }
      }
      await userDataRef.set(
        {
          securitiesOwned,
          portfolioChartData
        },
        { merge: true }
      );
      return response.status(200).json({
        message: "Prices Updated",
        type: "Success",
        info: "hi?"
      });
    } catch (err) {
      return response.status(400).send(err);
    }
  });
});

const calculateChangeUSD = (openedAt, currentPrice, type) => {
  let change = null;
  if (type === "short") {
    change = -(currentPrice - openedAt);
  } else {
    change = currentPrice - openedAt;
  }
  return parseFloat(change.toFixed(2));
};

const calculateChangePercentage = (openedAt, currentPrice, type) => {
  let change = null;
  if (type === "short") {
    change = -((currentPrice - openedAt) / openedAt) * 100;
  } else {
    change = ((currentPrice - openedAt) / openedAt) * 100;
  }
  return parseFloat(change.toFixed(2));
};
