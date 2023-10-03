const swaggerOpts = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Backend Project",
            version: "1.0.0",
            description: "OAS 3.0",
            contact: {
                name: "Guille Aguzi",
            },
        },
        servers: [
            {
                url: "http://localhost:8000/api/v1/",
            },
        ],
    },
    apis: [`./src/docs/**/*.yml`],
};

module.exports = swaggerOpts;
