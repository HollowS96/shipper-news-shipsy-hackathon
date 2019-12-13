import { Injectable } from "@nestjs/common";
import * as rp from 'request-promise';
import { Constants } from "../common/constants";
import { ConfigService } from "../config/config.service";
const moment = require('moment');
const Parser = require('rss-parser');
@Injectable()
export class NewsService {
    parser : any;
    constructor(readonly configService : ConfigService){
        this.parser = new Parser();
    }
    async getAll(){
        // Get all the results and do all the processing
        const marineLinkEndpoint = this.configService.getMarineLinkEndpoint();
        const rssURL = `${marineLinkEndpoint}?take=100`;
        const xmlResponse = await this.parser.parseURL(rssURL);
        const newsItems = xmlResponse.items;
        const result : any = [];
        if(newsItems && newsItems instanceof Array && newsItems.length > 0){
            newsItems.forEach((ele)=>{
                const news = {
                    title : ele.title,
                    link : ele.link,
                    description : ele.contentSnippet,
                    publishedTime : moment(ele.pubDate).valueOf()
                }
                result.push(news);
            });
        }
        return result;
    }
}