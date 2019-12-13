import { Controller, Get } from "@nestjs/common";
import { async } from "rxjs/internal/scheduler/async";

@Controller('/news')
export class NewsController {
    @Get('links')
    async fetch() {
        
    }
}