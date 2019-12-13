import { Controller, Get, Req, Res } from "@nestjs/common";
import { RootService } from "./root.service";

@Controller('')
export class RootController {
    @Get('/')
    async root() {
        return {
            status : 'ok',
            uptime : `${process.uptime()} seconds ago`
        }
    }
}