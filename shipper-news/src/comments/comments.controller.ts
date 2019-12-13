import { Controller, Get } from "@nestjs/common";

@Controller('comments')
export class CommentController{
    @Get('/getAll')
    async getAllComments(params : any){
        
    }
}