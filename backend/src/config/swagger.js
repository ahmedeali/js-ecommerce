const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JS E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the e-commerce backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: '/',
      },
    ],
  },
  
  apis: ['./src/routes/*.js'], // where Swagger reads comments
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
