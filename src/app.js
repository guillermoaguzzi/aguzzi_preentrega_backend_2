const express  = require("express");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");
const { NODE_ENV, PORT, API_VERSION } = require("./config/config");
const { mongoDBConnection } = require("./db/mongo.config.js");
const { MONGO_URL } = require("./db/mongo.config.js");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const { exec } = require('child_process');
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');


class App {
    app;
    httpServer;
    io;
    env;
    port;
    server;
    
    constructor(routes){
        this.app = express();
        this.httpServer = new HttpServer(this.app);
        this.io = new IOServer(this.httpServer);
        this.app.set("io", this.io);

        this.env = NODE_ENV || 'development';
        this.port = PORT || 8000;

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectDB();
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

    async connectDB() {
        await mongoDBConnection();
    }

    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/static', express.static(`${__dirname}/public`));
        this.app.use(cookieParser());
        this.app.use(
            session({
            store: mongoStore.create({
                mongoUrl: MONGO_URL,
                mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
                ttl: 60,
                // ttl: 60 * 3600
            }),
            secret: "secretS3ss10n",
            resave: false,
            saveUninitialized: false,
            })
        );
        initializePassport();
        this.app.use(passport.initialize());
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
            /* exec(`start http://localhost:${this.port}`); */
        });
    }

    initHandlebars() { this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
}

}

module.exports = App;
