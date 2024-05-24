import { URL } from 'node:url';
import {models, sequelize} from '../models/index.js';
import { Op, QueryTypes } from 'sequelize';
import {Job} from '../models/job.js';
import pkg from 'follow-redirects';
const {http, https} = pkg;

const CRAWL_DELAY = 10000;
const CRAWL_TIMEOUT = 60000;
const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36`;
const SAVE_HTML = false;

//@TODO add dependency injection for mocking
export const pingJobs = async () => {

    const ping = () => {

        //Eventuall will need to be a query for memory reasons
        models.Job.findAll(
            {
                where:{
                    status:{
                        [Op.eq]: "live"
                    }
                },
                order: sequelize.literal('rand()'),
                limit: 10
            }).then(jobList);

    }
    const jobList = async (jobs: Array<Job>) => {

        console.log(`Found ${jobs.length}`);

        for (const job of jobs) {

            console.log(job.source_url);
            const url = new URL(job.source_url);
            const getProtocol = (url.protocol === "https:") ? https.get : http.get;

            try {
                const dead = await isURLDead(url, getProtocol)
                job.dead = dead;
                await job.save()
            } catch(e) {
                console.log(e);
            }
            await wait(CRAWL_DELAY, false);


        }

    }

     const isURLDead = async (url: URL, getProtocol: typeof http.get) : Promise<boolean> => {

        return new Promise((resolve, reject) => {

            const controller = new AbortController();

            setTimeout(() => {
                controller.abort();
            }, CRAWL_TIMEOUT);

            const options = {
                signal: controller.signal, //Timeout
                headers: {
                    'User-Agent': USER_AGENT
                }
            };

            getProtocol(url,options, (res) => {
                let body = "";
                res.setEncoding('utf8');

                if (res.statusCode === undefined) {
                    console.warn(`Failed crawling URL:${url}`);
                    reject();
                }

                resolve(res.statusCode !== 200);

                if (SAVE_HTML) {

                    res.on('data', (d) => {
                        body += d;
                    });

                    res.on('end', () => {
                        saveHTML(url.toString(), body, res.statusCode);
                    });
                }

            }).on('error', (e) => {

                console.warn(e);
                //Wait even longer as we might be banned/rate limited
                reject();
            });
        });

    }

    const wait = async (ms:number, value:unknown) => {
        return new Promise(resolve => setTimeout(resolve, ms, value));
    }

    const saveHTML = (url:string, html:string, statusCode:number|undefined) => {

        if (statusCode === undefined)
            statusCode = 0

        sequelize.query(`
                        INSERT INTO crawl(url, html, status_code, created, updated)
                        VALUES(:url, :html, :status_code, NOW(), NOW())
                        ON DUPLICATE KEY UPDATE updated=VALUES(updated), html=VALUES(html),
                        status_code=VALUES(status_code)
                        `, {
                            replacements:{
                                url, html,
                                status_code: statusCode
                            },
                            type: QueryTypes.INSERT
                        });
    }
    ping();
}



pingJobs();





