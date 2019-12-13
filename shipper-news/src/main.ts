import { NestFactory, APP_PIPE } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
(global as any).startTime = new Date();


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
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setCors(app);
  await app.listen(8000,()=>{
    console.log('Server started');
  });
}
bootstrap();
