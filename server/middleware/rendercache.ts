import { Request, Response, NextFunction } from "express";
import dedent from "dedent";
import { env } from "process";

//Singleton for performance
let instance : RenderCache;

/*
 *
 * RenderCache is the express middleware to serve up
 * cached pages from any store (redis, orm, db, memory)
 *
 */
class RenderCache {

    private store: any;                         //ORM or mock object for testing
    private findOneFunc: string = "findByPk";   //Should be an ORM function to return one row by PATH
    private upsertFunc: string = "upsert";     //e.g. findByPk for sequelize, get for redis

    constructor() {
        if (!instance){
            instance = this;
            console.log("Rendercache constructor");
        }
        return instance;
    }

    set_store = (store:any, findOneFunc: string, upsertFunc: string) => {

        if (!store || !findOneFunc || !upsertFunc)
            throw new Error(dedent`Could not initialize RenderCache.
                                Store, findOneFunc, and upsertFunc is required`);

        this.store = store;
        this.findOneFunc = findOneFunc;
        this.upsertFunc = upsertFunc;
    }

    middleware = async (req: Request,res: Response, next: NextFunction) => {

        if (req.query.nocache || env.NODE_ENV === "development") {
            next();
            return;
        }

        const cache = await this.store[this.findOneFunc](req.path);

        if (cache === null) {
            next();
            return;
        }

        res.send(cache.html+"<!-- cached -->");
        return;
    }


    push = (path: string, body: string): Promise<boolean> => {

        return this.store[this.upsertFunc]({id:path, html: body});
    }

}

export default new RenderCache()
