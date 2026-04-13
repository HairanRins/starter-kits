/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import morgan from "morgan";
import { PRODUCTION_AUTHORIZED_HOSTS } from "./core/constants/cors-constants";
import { AllExceptionsFilter } from "./core/configs/allexceptions.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix("v1/api");

  app.useGlobalFilters(new AllExceptionsFilter());

  app.getHttpAdapter().getInstance().set("trust proxy", 1);

  app.enableCors({
    origin:
      process.env.NODE_ENV === "production" ? PRODUCTION_AUTHORIZED_HOSTS : "*",
    credentials: true,
  });

  app.use(morgan("dev"));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("BoilerPlate API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Redirect root to Swagger docs
  app.getHttpAdapter().get("/", (req, res) => {
    res.redirect("/docs");
  });

  await app.listen(process.env.PORT ?? 3000, "0.0.0.0", () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    );
    console.log(
      `Swagger docs available on http://localhost:${process.env.PORT ?? 3000}/docs`,
    );
  });
}
bootstrap();
