import { Injectable } from "@nestjs/common";
import { exec } from "child_process";

@Injectable()
export class RootService {
    async getUptime(res){
        return await new Promise((resolve,reject)=>{
            exec('uptime',(error,stdout,stdin)=>{
                if(error){
                    reject(error);
                }
                resolve(stdout);
            });
        })
    }
}