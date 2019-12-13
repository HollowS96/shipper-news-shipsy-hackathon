import { Injectable } from "@nestjs/common";
import * as rp from 'request-promise';
import { Constants } from "../common/constants";
import { ConfigService } from "../config/config.service";
import { Helper } from "../common/helper";
const moment = require('moment');
const Parser = require('rss-parser');
const lodash = require('lodash');
@Injectable()
export class NewsService {
    parser : any;
    constructor(readonly configService : ConfigService){
        this.parser = new Parser();
    }
    async getAll(){
        // Get all the results and do all the processing
        const marineLinkEndpoint = this.configService.getMarineLinkEndpoint();
        const rssURL = `${marineLinkEndpoint}?take=100&imageSize=w400`;
        const xmlResponse = await this.parser.parseURL(rssURL);
        const newsItems = xmlResponse.items;
        const result : any = [];
        if(newsItems && newsItems instanceof Array && newsItems.length > 0){
            newsItems.forEach((ele)=>{
                const news :any  = {
                    title : ele.title,
                    article_link : ele.link,
                    description : ele.contentSnippet,
                    published_time : moment(ele.pubDate).toDate(),
                    source : 'marinelink',
                    category : 'all'
                }
                if(ele.enclosure && ele.enclosure.type ==='image/jpeg'){
                    news.image_link = ele.enclosure.url;
                }
                result.push(news);
            });
            // Now store all the results in the db
        }
        return Helper.convertToCamelCaseObject(result);
    }
}