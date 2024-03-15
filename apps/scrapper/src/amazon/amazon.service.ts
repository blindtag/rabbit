import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  puppeteer  from 'puppeteer-core';

@Injectable()
export class AmazonService {
    constructor(private readonly configService:ConfigService){}

    async getProducts(products:string){
        const browser = await puppeteer.connect({
            browserWSEndpoint: this.configService.getOrThrow('SBR_WS_ENDPOINT')
        })
        try{
            const page = await browser.newPage()
            page.setDefaultNavigationTimeout( 2 * 60 * 1000)
            await Promise.all([
              page.waitForNavigation(),
              page.goto(this.configService.get<string>('URL'))  
            ])
        }finally{
            await browser.close();
        }
    }
}
