
import express, {Request, Response, NextFunction} from 'express';

export function Index (req: Request, res: Response, next: NextFunction) {

    res.render("index", {title: 'GoCodeRemote', version: '0.1.6'}, function(err, list) {

        res.send(list);
    });

}

