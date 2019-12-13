import { Controller, Get } from "@nestjs/common";
import { NewsService } from "./news.service";

@Controller('/news')
export class NewsController {
    constructor(readonly newsService : NewsService){}
    @Get('/getAll')
    async getAll(){
        return this.newsService.getAll();
    }
}