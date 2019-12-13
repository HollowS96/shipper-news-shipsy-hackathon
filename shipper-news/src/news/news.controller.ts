import { Controller, Get } from "@nestjs/common";
import { NewsService } from "./news.service";
import { async } from "rxjs/internal/scheduler/async";

@Controller('/news')
export class NewsController {
    constructor(readonly newsService : NewsService){}
    @Get('/getAll')
    async getAll(){
        return this.newsService.getAll();
    }

    @Get('/headlines')
    async getHeadlines(){
        return this.newsService.getHeadlines();
    }
}