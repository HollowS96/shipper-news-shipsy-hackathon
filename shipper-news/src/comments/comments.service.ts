import { Injectable } from "@nestjs/common";
import { GetAllCommentsDto } from "./GetAllComments.dto";
import { O_WRONLY } from "constants";
import { Helper } from "../common/helper";
import { PostCommentDto } from "./PostComments.dto";
import { LikeAndShareDto } from "./LikeAndShare.dto";

@Injectable()
export class CommentService{
    async getAllComments(params: GetAllCommentsDto){
        if(!params.articleId){
            throw new Error('Article Id is required');
        }
        const allCommentsQuery = `SELECT * FROM comments WHERE article_id = $1`;
        try{
            const response = await (global as any).pool.query(allCommentsQuery,[params.articleId]);
            return Helper.convertToCamelCaseObject(response);
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    async postComment(params : PostCommentDto){
        if(!params.articleId || !params.text){
            throw new Error('Comment object is wrong');
        }
        const insertQuery = `INSERT INTO comments(article_id , text, user_id,created_at) VALUES ($1,$2,$3,now())`;
        const updatedArticleQuery = `UPDATE news SET total_comments = total_comments + 1 WHERE id = $1`
        try{
            const response = await (global as any).pool.query(insertQuery,[params.articleId,params.text,params.userId]);
            // Update total comments in the article
            const updatedArticleQueryResponse = await (global as any).pool.query(updatedArticleQuery,[params.articleId]);
            return {
                status : 'ok'
            }
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    async updateLikesAndShare(params : LikeAndShareDto){
        if(!params.articleId || !params.type){
            throw new Error('ArticleId and type is necessary');
        }
        const typeToColumnMap = {
            'like' : 'total_likes',
            'facebook' : 'total_facebook_shares',
            'twitter' : 'total_twitter_shares',
            'linkedin' : 'total_linkedin_shares'
        }
        const queryString = `UPDATE news SET ${typeToColumnMap[params.type]} = ${typeToColumnMap[params.type]} + 1 WHERE id = $1`;
        try{
            const response = (global as any).pool.query(queryString,[params.articleId]);
            if(params.type === 'like' && params.userId){
                const typeQueryString = 'INSERT INTO likes(article_id, user_id, created_at) values($1,$2,now())';
                const typeQueryResponse = await (global as any).pool.query(typeQueryString,[params.articleId,params.userId]);
            }
            return {
                status : 'ok',
            }
        }
        catch(err){
            throw err;
        }
    }
}