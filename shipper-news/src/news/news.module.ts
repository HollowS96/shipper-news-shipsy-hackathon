import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { ConfigModule } from "../config/config.module";

@Module({
    imports : [ConfigModule],
    providers: [NewsService],
    controllers: [NewsController],
})
export class NewsModule {}