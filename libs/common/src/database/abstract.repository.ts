import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractDocument } from "./abstract.schema";
import { Connection, FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<TDocument extends AbstractDocument>{
    protected abstract readonly logger:Logger;
    constructor(
        protected readonly model:Model<TDocument>,
        protected readonly connection:Connection
        ){}
   
    async create(
        document:Omit<TDocument, '_id'>,
        options?:SaveOptions,
        ):Promise<TDocument>{
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId()
        });
        console.log(createdDocument)
        return (await createdDocument.save(options)
        ).toJSON() as unknown as TDocument;
    }
    
    async findOne(filterQuery:FilterQuery<TDocument>):Promise<any>{
        const document = await this.model.findOne(filterQuery, {}, {lean:true});
        console.log(document)

        if(!document){
            this.logger.warn(`Document not found with filterQuery`, filterQuery);
            throw new NotFoundException('Document not found')
        }

        return document;
    }

    async findOneAndUpdate(
        filterQuery:FilterQuery<TDocument>,
        updateQuery:UpdateQuery<TDocument>
    ){
        const document = await this.model.findOneAndUpdate(
            filterQuery,
            {$set:updateQuery},
            { lean:true,
              new:true }
        )
        if(!document){
            this.logger.warn(`Document not found with filterQuery`, filterQuery)
            throw new NotFoundException(`Document not found`)
        }
        return document;
    }

    async find(filterQuery:FilterQuery<TDocument>){
        console.log(filterQuery)
        return await this.model.find(filterQuery,{}, {lean:true})
    }

    async findOneAndDelete(filterQuery:FilterQuery<TDocument>){
        const document = await this.model.findByIdAndDelete(filterQuery,{lean:true})
        if(!document){
            this.logger.warn(`Document not found with filterQuery`, filterQuery)
            throw new NotFoundException(`Document not found`)
        }

        return 'Success'
    }

    async upsert(
        filterQuery:FilterQuery<TDocument>,
        document: Partial<TDocument>
    ){
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean:true,
            upsert:true,
            new:true
        })
    }

    async startTransaction(){
        const session = await this.connection.startSession()
        session.startTransaction()
        return session;
    } 

}