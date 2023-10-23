const express  = require("express");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");
const { DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV, PORT, API_VERSION } = require("./config/config");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const session = require("express-session");
const compression = require ("express-compression");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOpts = require("./config/swagger.config")

const passport = require("passport");
const initializePassportJWT = require("./config/passport.strategy.jwt.config");
const initializePassportGithub = require("./config/passport.strategy.github.config");
const { setLogger } = require ("./utils/logger.js");

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');


class App {
    app;
    httpServer;
    io;
    env;
    port;
    server;
    MONGO_URL;
    
    constructor(routes){
        this.app = express();
        this.httpServer = new HttpServer(this.app);
        this.io = new IOServer(this.httpServer);
        this.app.set("io", this.io);

        this.env = NODE_ENV || 'development';
        this.port = PORT || 8080;

        this.specs = swaggerJSDoc(swaggerOpts);

        this.MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@coderhousebackend.rnpebhq.mongodb.net/`;
    
        const connection = mongoose
        .connect(this.MONGO_URL)
        .then((conn) => {
            console.log("===MONGO CONNECTION STABLISHED===");
        })
        .catch((err) => {
            console.log("🚀 ~ file: app.js:25 ~ err:", err);
        });

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initHandlebars();
    }
    
    getServer() {
        return this.app;
    }

    closeServer(done) {
        this.server = this.httpServer.listen(this.port, () => {
            done()
        });
    }

    

    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/static', express.static(`${__dirname}/public`));
        this.app.use(cookieParser());
        this.app.use(
            compression({
                brotli: { enable: true, zlib: {} },
            })
        );
        this.app.use(
            cors({
                origin: "*",
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                })
            );
            
        this.app.use(
            session({
            store: mongoStore.create({
                mongoUrl: this.MONGO_URL,
                mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
                ttl: 60,
            }),
            secret: "secretS3ss10n",
            resave: false,
            saveUninitialized: false,
            })
        );
        initializePassportGithub();
        initializePassportJWT()
        this.app.use(passport.initialize());
        this.app.use(setLogger);
        this.app.use(`/api/${API_VERSION}/docs/`, swaggerUi.serve, swaggerUi.setup(this.specs));
    }
    
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use(`/api/${API_VERSION}`, route.router);
        });

        this.app.get("/", (req, res) => {
            res.redirect(`/api/${API_VERSION}/session/login`);
        });
    }

    listen() {
        this.httpServer.listen(this.port, () => {
            displayRoutes(this.app);
            console.log(`=================================`);
            console.log(`======= ENV: ${this.env} ========`);
            console.log(`🚀 App listening on the port ${this.port}`);
            console.log(`=================================`);
        });
    }

    initHandlebars() { this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
}

}

module.exports = App;
