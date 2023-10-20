const mongoose = require('mongoose');
const { DB_HOST, DB_PORT, DB_NAME } = require("../../config/config");
const {expect} = require('chai');
const SessionService = require('../../repository/sessions.repository');
const { beforeEach } = require('mocha');

const MONGO_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

/* const user1 = {
    firstName: "Louis",
    lastName: "Armstrong",
    age: "122",
    username: "larms",
    email: "satchmo@gmail.com",
    password: "chalala",
    role: "ADMIN"
}; */

mongoose.connection.close()

const sessionService = new SessionService();

// Inicializa la conexión a la base de datos antes de ejecutar las pruebas
before(async() => {
    mongoose.connect(`${MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
});

beforeEach(() => {
    
});

// Después de las pruebas, cierra la conexión a la base de datos
after(async() => {
    

});
it('should register a new user', () => { 
    const user1 = {
        firstName: "Louis",
        lastName: "Armstrong",
        age: "122",
        username: "larms",
        email: "satchmo@gmail.com",
        password: "chalala",
        role: "ADMIN"
    };
    console.log(user1)


    const newUser = sessionService.registerUser({ body: user1 });
        expect(newUser).to.exist;
        /* expect(newUser).to.eq(200); */
});

/* describe('Session Repository Tests', () => {
    describe('registerUser', () => {

    });

}); */
