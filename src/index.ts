import 'dotenv/config';

import express from 'express';
import swaggerUI from 'swagger-ui-express';

import { getEnvvarValue } from './utils/envvar';
import { getSwaggerOption } from './utils/swagger';

const app = express();

const {
  value: port,
} = getEnvvarValue('PORT', true, (error) => {
  if (error) {
    throw new Error(error);
  }
});

getSwaggerOption(app, `http://localhost:${port}`, (options) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(undefined, options));
  app.listen(3000)
})

