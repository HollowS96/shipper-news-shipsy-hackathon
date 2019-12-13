import { Controller, Get, Req, Query, Post, Body } from "@nestjs/common";
import { CommentService } from "./comments.service";
import { GetAllCommentsDto } from "./GetAllComments.dto";
import { PostCommentDto } from "./PostComments.dto";
import { LikeAndShareDto } from "./LikeAndShare.dto";

@Controller('comments')
export class CommentController{
    constructor(readonly commentService : CommentService){};
    @Get('/getAll')
    async getAllComments(@Req() req, @Query() params : GetAllCommentsDto){
        return await this.commentService.getAllComments(params);
    }

    @Post('/postComment')
    async postComment(@Req() req, @Body()comment: PostCommentDto){
        return await this.commentService.postComment(comment);
    }

    @Post('/updateLikesAndShare')
    async updateLikesAndShare(@Req() req, @Body()params : LikeAndShareDto){
        return await this.commentService.updateLikesAndShare(params);
    }
}