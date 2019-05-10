const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
const port = process.env.PORT || 7000;

const session = require("express-session");

server.use(bodyParser.json());
server.use(cors());

server.get("/", (req, res) => {
  console.log("req.session ===> ", req.session);

  if (req.session && req.session.username) {
    res.status(200).json({ msg: `but welcome back ${req.session.username}` });
  } else {
    res.status(500).json({ msg: `server is here , who are U?` });
  }
});

const loggerMiddleware = (req, res, next) => {
  console.log(req.body.password);
  if (req.body.password && req.body.password !== "aissani") {
    res.status(500).json(" === wrong password === ");
    return;
  }
  next();
};
server.use(loggerMiddleware);

////////////////////////////////////////////

server.use(
  session({
    secret: "infosys is my company",
    cookie: { maxAge: 1 * 60 * 60 * 24 * 10000 },
    httpOnly: true,
    secure: false, // use true only in production,
    resave: false,
    saveUninitialized: true,
    name: "new CooKie"
  })
);

server.post("/login", (req, res) => {
  console.log(" request  params ===>", req.params);

  console.log("headers ===> ", req.headers);
  req.session.username = "infosys";
  console.log("req session ===> ", req.session);
  res.status(200).json({
    msg: " user successfully added  and we have a cookie  ",
    sess: req.session.username
  });
});

server.post("/login/:id", (req, res) => {
  console.log(" request  params ===>", req.params);

  console.log("query ===> ", req.query);

  res.status(200).json({ msg: " user successfully added " });
});

server.listen(port, () => {
  console.log(`server is connected on port ${port}`);
});
