import swaggerJSDoc from 'swagger-jsdoc';


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'StumbleSafe API',
        version: '1.0.0',
        description: 'API de l\'application mobile StumbleSafe ',
    },
};


const options = {
    swaggerDefinition,
    apis: ['./routes/*js'],
    components: {
        securitySchemes: {
          ApiKeyAuth: { // Arbitrary name for the security scheme
            type: 'apiKey',
            in: 'header', // Can be 'header', 'query', or 'cookie'
            name: 'Authorization', // Name of the header, query parameter, or cookie to be used as the API key
          },
        },
    },
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
