const express  = require("express");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");
const { NODE_ENV, PORT, API_VERSION } = require("./config/config");
const { mongoDBConnection } = require("./db/mongo.config.js");


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
    }

    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use(`/api/${API_VERSION}`, route.router);
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
