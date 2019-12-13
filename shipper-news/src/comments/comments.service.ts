import { Injectable } from "@nestjs/common";
import { GetAllCommentsDto } from "./GetAllComments.dto";

@Injectable()
export class CommentService{
    async getAllComments(params: GetAllCommentsDto){
        
    }
}