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
    async getAll(params : NewsDto){
        // Get all the results and do all the processing
        const marineLinkEndpoint = this.configService.getMarineLinkEndpoint();
        const rssURL = `${marineLinkEndpoint}?take=300&imageSize=w400`;
        const xmlResponse = await this.parser.parseURL(rssURL);
        const newsItems = xmlResponse.items;
        if(newsItems && newsItems instanceof Array && newsItems.length > 0){
            const values :string [] = [];
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
                values.push(`('${news.title}','${news.article_link}','${news.description}','${news.published_time}','${news.source}','${news.category}','${news.image_link}')`)
            });
            // Now store all the results in the db
            let insertQuery = `INSERT INTO news(title,article_link,description,published_time,source,category,image_link) VALUES`;
            insertQuery = insertQuery + values.join(',') + ' ON CONFLICT DO NOTHING';
            try{
                const insertedResult = await (global as any).pool.query(insertQuery);
                console.log('inserted',insertedResult.length);
            }
            catch(err){
                console.log(err);
            }
            
        }
        const startValue = (params.currentPageNumber && params.currentPageNumber - 1 || 0) * 50;
        const endValue = startValue + 50;
        const selectQuery = 'SELECT *,ROW_NUMBER() OVER(ORDER BY published_time DESC) AS rank FROM news WHERE rank >= $1 and rank <= $2 ';
        const response = await (global as any).pool.query(selectQuery,[startValue,endValue]);
        return Helper.convertToCamelCaseObject(response);
    }

    async getHeadlines() {
        const searchEnum = ['export import','export','import'];
        const result: any [] = [];
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
                    const news :any  = {
                        title : ele.title,
                        article_link : ele.url,
                        description : ele.description,
                        published_time : moment(ele.publishedAt).toDate(),
                        source : ele.source.name,
                        category : 'headlines',
                        image_link: ele.urlToImage
                    }
                    console.log(news);
                    result.push(news);
                });
                return result;
            }
        }
    }
}