import { Injectable } from "@nestjs/common";
import * as rp from 'request-promise';
import { Constants } from "../common/constants";
import { ConfigService } from "../config/config.service";
import { Helper } from "../common/helper";
import { NewsDto } from "./news.dto";
const moment = require('moment');
const Parser = require('rss-parser');
const newsAPI = require('newsapi');
const lodash = require('lodash');
@Injectable()
export class NewsService {
    parser : any;
    constructor(readonly configService : ConfigService){
        this.parser = new Parser();
    }

    async insertIntoNews(allNews : any[]){
        const values :string [] = [];
        let currentParameter = 1;
        let insertQuery = `INSERT INTO news(title,article_link,description,published_time,source,category,image_link) VALUES`;
        const paramsString : string[] = [];
        allNews.forEach((news)=>{
            values.push(news.title,news.article_link,news.description,news.published_time,news.source,news.category,news.image_link);
            paramsString.push(`${Helper.getInStr(7,currentParameter)}`);
            currentParameter += 7;
        })
        insertQuery = insertQuery + paramsString.join(',') + ' ON CONFLICT DO NOTHING RETURNING *';
        try{
            const insertedResult = await (global as any).pool.query(insertQuery,values);
            console.log('inserted',insertedResult.rows.length);
        }
        catch(err){
            console.log(err);
        }
    }

    async selectRows(category : string,currentPageNumber? : number){
        try{
            let startValue = 1;
            let endValue = 10;
            if(category === 'all' && currentPageNumber){
                startValue = (currentPageNumber - 1 || 0) * 10;
                endValue = startValue + 9;
            }
           const selectQuery = `
                WITH news_result AS (
                    SELECT *,
                    ROW_NUMBER() OVER(ORDER BY published_time DESC) AS rank FROM news
                    WHERE category = '${category}'
                )
                select * from news_result WHERE rank >= $1 and rank <= $2`;
            const response = await (global as any).pool.query(selectQuery,[startValue,endValue]);
            return Helper.convertToCamelCaseObject(response.rows);
        } catch(err){
            console.log(err);
            throw err;
        }
    }

    async getAll(params : NewsDto){
        // Get all the results and do all the processing
        const marineLinkEndpoint = this.configService.getMarineLinkEndpoint();
        const rssURL = `${marineLinkEndpoint}?take=300&imageSize=w400`;
        const xmlResponse = await this.parser.parseURL(rssURL);
        const newsItems = xmlResponse.items;
        if(newsItems && newsItems instanceof Array && newsItems.length > 0){
            const allNews : any = [];
            newsItems.forEach((ele)=>{
                const news :any  = {
                    title : ele.title,
                    article_link : ele.link,
                    description : ele.contentSnippet,
                    published_time : moment(ele.pubDate).toDate(),
                    source : 'marinelink',
                    category : 'all',
                    image_link : null,
                }
                if(ele.enclosure && ele.enclosure.type ==='image/jpeg'){
                    news.image_link = ele.enclosure.url;
                }
                allNews.push(news);
            });
            // Now store all the results in the db
            await this.insertIntoNews(allNews);
        }
        return await this.selectRows('all',params.currentPageNumber)
    }

    async getHeadlines() {
        const searchEnum = ['export import','export','import'];
        const allNews: any [] = [];
        const news = new newsAPI('7e38f5e3d9694f35a3ce9a5444c247e6');
        const params:any = {
            language: 'en',
           // country: 'in',
            category: 'business',
        };
        // params.q = searchEnum.join(' ');
        let headlines;
        for (let i=0;i< searchEnum.length; i++) {
            params.q = searchEnum[i];
            headlines = await news.v2.topHeadlines(params);
            if (headlines.totalResults > 0) {
                headlines.articles.forEach(ele => {
                   if (ele.urlToImage) {
                    const news :any  = {
                        title : ele.title,
                        article_link : ele.url,
                        description : ele.description,
                        published_time : moment(ele.publishedAt).toDate(),
                        source : ele.source.name,
                        category : 'headlines',
                        image_link: ele.urlToImage
                    }
                    allNews.push(news);
                }
                });
                await this.insertIntoNews(allNews);
                return await this.selectRows('headlines');
            }
        }
    }
}