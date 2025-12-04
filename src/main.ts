import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Ventas')
    .setDescription(
      'Aplicación para gestionar productos, marcas, lineas, proveedores y ventas',
    )
    .setVersion('1.0')
    .addTag('Ventas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
