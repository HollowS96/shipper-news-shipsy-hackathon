import { Controller, Get, Req, Query } from "@nestjs/common";
import { NewsService } from "./news.service";
import { NewsDto } from "./news.dto";

@Controller('/news')
export class NewsController {
    constructor(readonly newsService : NewsService){}
    @Get('/getAll')
    async getAll(@Req() req, @Query() params: NewsDto){
        return this.newsService.getAll(params);
    }
}