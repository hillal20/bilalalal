//const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const server = express();
const port = process.env.PORT || 7000;
const hydraExpress = require("hydra-express");
const session = require("express-session");
const config = require("./config.json");

///// =============  register hydra  ==============================================

/*
to make microservices works , i have to changes the 
port number to 0 in the config.json file


*/
const register = () => {
  const express = hydraExpress.getExpress();
  const server = express();
  const router = express.Router();

  hydraExpress.registerRoutes({
    "": router
  });

  const middleWare = (req, res, next) => {
    console.log("== i am middleWARE  === ");
    if (req.body.name === "hilal") {
      res.send("you can not pass ");
    } else {
      next();
    }
  };

  server.use(bodyParser.json());
  server.use(cors());

  router.post("/middle", middleWare, (req, res) => {
    console.log(req.body.name);
    res.send(" ===  iam  the route === ");
  });

  router.post("/middle*", middleWare, (req, res) => {
    console.log(req.body.name);
    res.send(" ===  iam  the route *****  === ");
  });

  router.get("/hydra", (req, res) => {
    const hydra = hydraExpress.getHydra();
    res.send(` service name : ${hydra.getServiceName()} 
    && service ID : ${hydra.getInstanceID()}
    
    `);
  });

  const logger = (req, res, next) => {
    console.log("===== i am requesting  ==== ");
    next();
  };
  const loggerMiddleware = (req, res, next) => {
    console.log(req.body.password);
    if (req.body.password && req.body.password !== "aissani") {
      res.status(500).json(" === wrong password === ");
      return;
    }
    next();
  };

  router.use(logger);
  router.use(loggerMiddleware);

  //////////////////////////////////////////

  router.use(
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

  router.get("/", (req, res) => {
    console.log("req.session1 ===> ", req.session.username);
    if (req.session && req.session.username) {
      res.status(200).json({ msg: `but welcome back ${req.session.username}` });
    } else {
      res.status(500).json({ msg: `server is here , who are U? via hydra` });
    }
    //res.send("login");
  });

  router.post("/login", loggerMiddleware, (req, res) => {
    console.log(" request  params ===>", req.params);
    console.log("headers ===> ", req.headers);
    req.session.username = "infosys";
    console.log("req session ===> ", req.session);
    res.status(200).json({
      msg: " user successfully added  and we have a cookie  ",
      sess: req.session.username
    });
  });

  router.post("/login/:id", (req, res) => {
    console.log(" request  params ===>", req.params);

    console.log("query ===> ", req.query);

    res.status(200).json({ msg: " user successfully added " });
  });
};
hydraExpress.init(config, register);

// ========== server without hydra ==============

// server.get("/", (req, res) => {
//   console.log("req.session ===> ", req.session);

//   if (req.session && req.session.username) {
//     res.status(200).json({ msg: `but welcome back ${req.session.username}` });
//   } else {
//     res.status(500).json({ msg: `server is here , who are U?` });
//   }
// });

// const loggerMiddleware = (req, res, next) => {
//   console.log(req.body.password);
//   if (req.body.password && req.body.password !== "aissani") {
//     res.status(500).json(" === wrong password === ");
//     return;
//   }
//   next();
// };
// server.use(loggerMiddleware);

// ////////////////////////////////////////////

// server.use(
//   session({
//     secret: "infosys is my company",
//     cookie: { maxAge: 1 * 60 * 60 * 24 * 10000 },
//     httpOnly: true,
//     secure: false, // use true only in production,
//     resave: false,
//     saveUninitialized: true,
//     name: "new CooKie"
//   })
// );

// server.post("/login", (req, res) => {
//   console.log(" request  params ===>", req.params);

//   console.log("headers ===> ", req.headers);
//   req.session.username = "infosys";
//   console.log("req session ===> ", req.session);
//   res.status(200).json({
//     msg: " user successfully added  and we have a cookie  ",
//     sess: req.session.username
//   });
// });

// server.post("/login/:id", (req, res) => {
//   console.log(" request  params ===>", req.params);

//   console.log("query ===> ", req.query);

//   res.status(200).json({ msg: " user successfully added " });
// });

// server.listen(port, () => {
//   console.log(`server is connected on port ${port}`);
// });
