import swaggerJSDoc from 'swagger-jsdoc';


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'StumbleSafe API',
        version: '1.0.0',
        description: 'API de l\'application mobile StumbleSafe ',
    }
    ,
};


const options = {
    swaggerDefinition,
    apis: ['./routes/*js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
