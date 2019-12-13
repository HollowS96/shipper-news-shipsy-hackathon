import { Inject, Injectable } from "@nestjs/common";
const config = require('../../config.json')
@Injectable()
export class ConfigService {
    getMarineLinkEndpoint(){
        return config['marineLinkEndpoint'];
    }

    getNewsAPIKey(){
        return config['newsAPIKey'];
    }
}