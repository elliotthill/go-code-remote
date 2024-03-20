import {models, sequelize} from '../../models/index.js';
import {QueryTypes, QueryOptions, QueryOptionsWithType} from "sequelize";
import express, {Request, Response, NextFunction} from 'express';
import {Meta} from "../../models/meta.js";

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

/*
 * This is the main jobs endpoint, it returns a list of jobs that match the
 * filters supplied.
 *
 * All user inputs end up parameterized
 */
export async function jobController(req: Request, res: Response, next: NextFunction) {


    const location_param = Number(req.query.location);    //Value Label pair
    const role_param = req.query.role;            //String
    const remote_param = req.query.remote;
    const sort = req.query.sort;


    let where_clause = "";
    let role_param_like = '';
    let order_clause = "created DESC";

    /*
     * Order options
     */
    if (sort === 'money') {
        order_clause = "rate DESC"
    } else if (sort === 'rating') {
        order_clause = "company.glassdoor DESC"
    }


    /*
     * Location filtering
     */
    if (location_param && location_param != 1000) {

        where_clause = " AND location.id = :location_id ";


        /*
         * These are harcoded locations like US, CA, or California
         * that refer to multiple locations. So we overwrite the location id above
         * and do custom logic for these
         */

        switch(location_param) {
            case 999: {
                where_clause = " AND location.country = 'US' ";
                break;
            }
            case 998: {
                where_clause = " AND location.country = 'UK' ";
                break;
            }
            case 997: {
                where_clause = " AND location.country = 'CA' ";
                break;
            }
            case 996: {
                where_clause = " AND location.currency = '€' "; //EU is not a country so we have to make do
                break;
            }
            case 995: {
                where_clause = " AND location.country = 'AUS' "; //EU is not a country so we have to make do
                break;
            }
            case 994: {
                where_clause = " AND location.state = 'CA' "; //EU is not a country so we have to make do
                break;
            }
            case 993: {
                where_clause = " AND location.state = 'TX' "; //EU is not a country so we have to make do
                break;
            }
            default: {
                //statements;
                break;
            }
        }

    }

    /*
     * Remote only checkbox
     */
    if (remote_param) {
        where_clause += " AND (job.remote = 'remote' OR job.remote = 'remote domestic') ";
    }

    /*
     * The text search
     *
     * This is the big one to get right, it needs improvement. Probably requires some kind of proper
     * full text index.
     */
    if (role_param) {
        where_clause += " AND (MATCH(search_keywords) AGAINST(:role_param IN NATURAL LANGUAGE MODE) OR search_keywords LIKE :role_param_like)";
        role_param_like = `%${role_param}%`;
    }

    /*
     * Experience options
     */
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

    if (exp_filters.length > 0) {
        where_clause += ` AND job.experience IN(${exp_filters.join(',')}) `;
    }


    /*
     * Handle pagination
     */

    const posts_per_page = 25;
    let page = req.query.p ? req.query.p : 1;
    page = parseInt(page.toString());

    const offset = (page - 1) * posts_per_page;

    /*
     * Here we build the main jobs query
     *
     * We can't use entirely parameterized queries here due to the complicated filtering options
     * so we use sequelize.escape() for those parts of the queries that contain data from the client
     */
    let jobs  = await sequelize.query<any>(` 
        SELECT job.id, role.role as role, company.company as company, location.location as location, job.experience as experience,
        created, updated, job.source_url as source_url, job.type as type, job.rate as rate, count(DISTINCT job.id)-1 as other_locations,
        CONCAT(\
          '[',\
          GROUP_CONCAT(DISTINCT JSON_OBJECT(
            'value', meta.id,
            'label', meta.value
          ) ),
        ']') as meta, company.meta as company_meta,
        location.state as state, location.country as country, location.currency as currency, company.glassdoor as glassdoor,
        company.indeed as indeed, job.remote as remote, DATEDIFF(NOW(), job.created) as days_old, job.more_jobs as more_jobs,
        company.careers_page as careers_page
        FROM job
        LEFT JOIN company ON job.company_id = company.id
        LEFT JOIN location ON job.location_id = location.id
        LEFT JOIN role ON job.role_id = role.id
        LEFT JOIN job_meta ON job_meta.job_id= job.id
        LEFT JOIN meta ON job_meta.meta_id = meta.id
        WHERE status='live' ${where_clause}
        GROUP BY job.role_id, job.company_id
        ORDER BY ${order_clause}
        LIMIT :posts_per_page OFFSET :offset
        `, {
        replacements: {
            location_id: location_param,
            role_param: role_param,
            role_param_like: role_param_like,
            posts_per_page: posts_per_page,
            offset: offset
        },
        type: QueryTypes.SELECT
    });


    /*
     * Parse it as JSON here, so Express can send it as JSON and not strings
     *
     */
    jobs.map(job => {

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


