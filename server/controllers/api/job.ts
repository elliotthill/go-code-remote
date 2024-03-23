import {models, sequelize} from '../../models/index.js';
import {QueryTypes, QueryOptions, QueryOptionsWithType} from "sequelize";
import express, {Request, Response, NextFunction} from 'express';
import {Meta} from "../../models/meta.js";
import { JobListFilter } from '../data/job_list_filter.js';

/*
 * This is used to pass a list of locations to the front end
 */
export async function jobLocationsController(req: Request, res: Response, next: NextFunction) {


    let locations = await sequelize.query<Location>(`
        SELECT id as value, CONCAT(location, ', ', IFNULL(state, country)) as label
        FROM location
        WHERE id NOT IN(1,17)
        `, {
        type: QueryTypes.SELECT
    });

    res.json(locations);
}

export async function jobController(req: Request, res: Response, next: NextFunction) {

    const jobListFilter = new JobListFilter(sequelize);

    switch (req.query.sort) {
        case "money":
            jobListFilter.set_sort("money");
            break;
        case "rating":
            jobListFilter.set_sort("rating");
            break;
    }

    const location_param = Number(req.query.location);
    if (location_param && location_param != 1000) {

        switch(location_param) {
            case 999:
                jobListFilter.set_location_US(); break;
            case 998:
                jobListFilter.set_location_UK(); break;
            case 997:
                jobListFilter.set_location_CA(); break;
            case 996:
                jobListFilter.set_location_europe(); break;
            default: {
                jobListFilter.set_location_filter(location_param);
                break;
            }
        }
    }

    if (req.query.remote)
        jobListFilter.set_remote_only();

    if (req.query.role)
        jobListFilter.set_full_text_search(req.query.role?.toString());

    const senior_filter = req.query.senior;
    const mid_filter = req.query.mid;
    const entry_filter = req.query.entry;

    let exp_filters = [];

    if (senior_filter)
        exp_filters.push("'senior'")
    if (mid_filter)
        exp_filters.push("'mid'")
    if (entry_filter)
        exp_filters.push("'entry'")

    if (exp_filters.length > 0)
        jobListFilter.set_experience_filter(exp_filters);

    let page = req.query.p ? req.query.p : 1;
    page = parseInt(page.toString());

    jobListFilter.set_page(page, 25);

    let jobs = await jobListFilter.get_results();

    /*
    * Parse it as JSON here, so Express can send it as JSON and not strings
    */
    jobs.map((job:any) => {

        job.meta = JSON.parse(job.meta) //The meta becomes JSON instead of a string

        //We have to filter out NULL meta tags that MySQL outputs
        //We can't use IF() in MySQL because that causes malformed JSON in rare cases
        job.meta = job.meta.filter((meta: Meta) => {
            return meta.value !== null;
        })


        if (job.company_meta)
            job.company_meta = JSON.parse(job.company_meta)
        else
            job.company_meta = [];

        //Append utm_source=gocoderemote.com to job URL
        try {
            let outbound_url = new URL(job.source_url);
            outbound_url.searchParams.append('utm_source', "gocoderemote.com");
            job.source_url = outbound_url.toString();
        } catch (e) {
            //URL was bad or null, we don't care
        }

        //Append utm_source=gocoderemote.com to careers page URL
        try {
            let outbound_careers = new URL(job.careers_page);
            outbound_careers.searchParams.append('utm_source', "gocoderemote.com");
            job.careers_page = outbound_careers.toString();
        } catch (e) {
            //URL was bad or null, we don't care
        }

    })

    res.json(jobs);


}

