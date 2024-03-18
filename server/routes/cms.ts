'use strict';

import express from 'express';
const router = express.Router();

import {models, sequelize} from '../models/index.js';

/*
 * Load CMS info for existing job - NOT for public consumption
 */
router.get('/job/:job', async function(req, res, next) {

    if (!req.isAuthenticated()) {
        res.status(500).json({'meta': {'status': 'error', 'error': 'Permission denied'}});
        return;
    }

    const job_id = req.params.job;

    let job = await sequelize.query(" \
        SELECT job.id, role.role as role, company.`company` as company, location.location as location, \
        created, updated, job.source_url as source_url, job.type as type, job.rate as rate, job.title as title,\
        job.remote as remote, job.more_jobs as more_jobs, job.experience as experience\
        FROM job\
        LEFT JOIN company ON job.company_id = company.id\
        LEFT JOIN location ON job.location_id = location.id\
        LEFT JOIN role ON job.role_id = role.id\
        WHERE job.id=:job_id\
        LIMIT 1\
        ", {
        replacements: {
            job_id:job_id
        },
        type: sequelize.QueryTypes.SELECT,
        plain: true
    });

    let meta = await sequelize.query(" \
        SELECT meta.id as value, meta.`value` as label\
        FROM job_meta\
        LEFT JOIN meta ON meta.`id` = job_meta.meta_id\
        WHERE job_id = :job_id\
        ", {
        replacements: {
            job_id:job_id
        },
        type: sequelize.QueryTypes.SELECT,
    });

    res.json({"job":job, "meta":meta});

});



/*
 * Create a new job
 */
router.post('/job', async function(req, res) {

    if (!req.isAuthenticated()) {
        res.status(500).json({'meta':{'status': 'error', 'error': 'Permission denied'}});
        return;
    }

    let role = req.body.role;
    let company = req.body.company;
    let location = req.body.location;
    let source_url = req.body.source_url;
    let type = req.body.type.value;
    let rate = req.body.rate;
    let title = req.body.title;
    let remote = req.body.remote.value;
    let more_jobs = req.body.more_jobs;
    let experience = req.body.experience.value;

    if (!title)
        title = role;

    if (!rate)
        rate = 0;

    if (!more_jobs)
        more_jobs = 0;

    const [role_found, role_created] = await models.Role.findOrCreate({
        where: {role: role}
    });
    let role_id = role_found.id;

    const [company_found, company_created] = await models.Company.findOrCreate({
        where: {company: company}
    });
    let company_id = company_found.id;

    const [location_found, location_created] = await models.Location.findOrCreate({
        where: {location: location}
    });
    let location_id = location_found.id;

    console.log("Company ID=?>");
    console.log(company_id);

    /*
     * Add title role and meta tags to the search keywords fields
     * so we can search for them
     */
    let search_keywords = `${title} ${role} ${company} `;
    search_keywords = add_synonyms(role, search_keywords);


    await Promise.all(req.body.meta?.map(async (meta) => {

        search_keywords += ` ${meta.label}`;
    }));


    /*
     * Job Insert
     */
    let result = await sequelize.query(" \
        INSERT INTO job (company_id, location_id, role_id, source_url, type, rate, title, remote, search_keywords, more_jobs, experience, created, updated)\
        VALUES(:company_id, \
        :location_id, \
        :role_id, \
        :source_url,\
        :type,\
        :rate,\
        :title,\
        :remote,\
        :search_keywords,\
        :more_jobs,\
        :experience,\
        NOW(), NOW())\
        ON DUPLICATE KEY UPDATE updated=NOW(), type=VALUES(type), rate=VALUES(rate),\
        title=VALUES(title), source_url=VALUES(source_url), search_keywords=VALUES(search_keywords),\
        remote=VALUES(remote), more_jobs=VALUES(more_jobs), experience=VALUES(experience)\
        ", {
        replacements: {
            role_id: role_id,
            company_id: company_id,
            location_id: location_id,
            source_url: source_url,
            type: type,
            rate: rate,
            title: title,
            remote: remote,
            search_keywords: search_keywords,
            more_jobs: more_jobs,
            experience: experience
        },
        type: sequelize.QueryTypes.INSERT
    })

    //Retreive the id
    let job_id = result[0];
    console.log("Job id => ");
    console.log(job_id);

    /*
     * Insert meta
     */
    let all_meta = req.body.meta; //An array of meta

    //Wipe existing meta
    const wipe = await sequelize.query(" \
            DELETE FROM job_meta\
            WHERE job_id=:job_id\
            ", {
            replacements: {job_id:job_id},
            type: sequelize.QueryTypes.DELETE
    });


    await Promise.all(all_meta.map(async (meta) => {
        const ignore = await sequelize.query(" \
            INSERT IGNORE INTO job_meta(job_id, meta_id)\
            VALUES(:job_id, :meta_id)\
            ", {
            replacements: {job_id:job_id, meta_id: meta.value},
            type: sequelize.QueryTypes.INSERT
        });
    }));



    res.json({'meta':{'status': 'success'}});

});

function add_synonyms(role, search_keywords) {

    if (role.includes("Developer")) {
        search_keywords += " Engineer";
    }

    if (role.includes("Engineer"))
        search_keywords += " Developer";



    return search_keywords;
}


router.post('/job/:job/delete', async function(req, res, next){

    if (!req.isAuthenticated()) {
        res.status(500).json({'meta': {'status': 'error', 'error': 'Permission denied'}});
        return;
    }

    const job_id = req.params.job;


    let result = await sequelize.query(`
        UPDATE job
        SET status='trashed'
        WHERE job.id=:job_id
        LIMIT 1
        `, {
        replacements: {
            job_id: job_id
        },
        type: sequelize.QueryTypes.UPDATE
    });

    res.json({"status":"success"});

});

router.post('/job/check-duplicates', async (req, res, next) => {

    if (!req.isAuthenticated()) {
        res.status(500).json({'meta': {'status': 'error', 'error': 'Permission denied'}});
        return;
    }

    const source_url = req.body.source_url;

    let result = await sequelize.query(`
        SELECT COUNT(*) as duplicates
        FROM job
        WHERE source_url=:source_url
        `, {
        replacements: {
            source_url: source_url
        },
        plain: true,
        type: sequelize.QueryTypes.SELECT
    });


    res.json(result);

});

/*
 * Get the other locations available for this job
 */
router.get('/job/other-locations/:job', async function(req, res, next) {

    if (!req.isAuthenticated()) {
        res.status(500).json({'meta': {'status': 'error', 'error': 'Permission denied'}});
        return;
    }

    const job_id = req.params.job;

    const job = await Job.findOne({
        where: {id: job_id}
    });

    let jobs = await sequelize.query(" \
        SELECT location.location as location, location.state as state, location.country as country, job.id as id\
        FROM job\
        LEFT JOIN location ON job.location_id = location.id\
        WHERE job.role_id=:role_id AND job.company_id=:company_id AND job.id != :job_id_exclude\
        ", {
        replacements: {
            location_id: job.location_id,
            role_id: job.role_id,
            company_id: job.company_id,
            job_id_exclude: job.id
        },
        type: sequelize.QueryTypes.SELECT
    });



    res.json({"jobs":jobs});

});





export default router;