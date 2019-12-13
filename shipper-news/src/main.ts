import { NestFactory, APP_PIPE } from '@nestjs/core';
import { AppModule } from './app.module';
const config = require('../config.json');
const Pool = require('pg').Pool;
(global as any).startTime = new Date();

function setUpPostgres(){
  const pool = new Pool({
    user: 'shipsy',
    host : 'shipsy3.c6j0kg8qztrp.us-west-2.rds.amazonaws.com',
    database : 'eximpulse',
    password :  '!shipsy432',
    port : 5432,
  });
  (global as any).pool = pool;
}

function setCors(app){
  app.enableCors({
		allowedHeaders: [
			'access-token',
			'Accept',
			'application-type',
			'Authorization',
			'Content-Disposition',
			'Content-Type',
			'Origin',
			'X-Requested-With',
			'user-id',
			'organisation-id',
			'username',
			'organisation-pretty-name',
			'X-LogRocket-URL',
		],
		exposedHeaders: ['Content-Disposition'],
	});
}
function setup(app){
  setCors(app);
  setUpPostgres();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setup(app);
  await app.listen(8000,()=>{
    console.log('Server started');
  });
}
bootstrap();
