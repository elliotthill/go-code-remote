import {models, sequelize} from "../models/index.js"
import {QueryTypes} from "sequelize"
import {Meta} from "../models/meta.js"
import {Job} from "../models/job.js"
import {serialyzLocationItem} from "../cron/sync.js"

interface MetaValueLabel {
    label: string
    value: string
}

export const create = async (title: string, link: string, location: serialyzLocationItem, company: string) => {
    const [role_found, role_created] = await models.Role.findOrCreate({
        where: {role: title}
    })
    let role_id = role_found.id

    const [company_found, company_created] = await models.Company.findOrCreate({
        where: {company: company}
    })
    let company_id = company_found.id

    let location_filter: any = {}

    if (location.city) location_filter.location = location.city
    if (location.state) location_filter.state = location.state
    if (location.countryCode) location_filter.country = location.countryCode

    const [location_found, location_created] = await models.Location.findOrCreate({
        where: location_filter
    })
    let location_id = location_found.id

    /*
     * Add title role and meta tags to the search keywords fields
     * so we can search for them
     */
    let search_keywords = `${title} ${company} `
    search_keywords = add_synonyms(title, search_keywords)

    let remote = "in-office"

    if (location.city && location.city.toLowerCase().includes("remote")) remote = "remote"
    /*
     * Job Insert
     */
    let result = await sequelize.query(
        `
        INSERT INTO job (company_id, location_id, role_id, source_url, type, title, remote, search_keywords, created, updated)
        VALUES(:company_id,
        :location_id,
        :role_id,
        :source_url,
        :type,
        :title,
        :remote,
        :search_keywords,
        NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated=NOW(), type=VALUES(type), rate=VALUES(rate),
        title=VALUES(title), source_url=VALUES(source_url), search_keywords=VALUES(search_keywords),
        remote=VALUES(remote), more_jobs=VALUES(more_jobs), experience=VALUES(experience)
        `,
        {
            replacements: {
                role_id: role_id,
                company_id: company_id,
                location_id: location_id,
                source_url: link,
                type: "permanent",
                title: title,
                remote: remote,
                search_keywords: search_keywords
            },
            type: QueryTypes.INSERT
        }
    )

    //Retreive the id
    let job_id = result[0]
    console.log("Job id => ")
    console.log(job_id)

    return job_id
}

export function add_synonyms(role: string, search_keywords: string) {
    if (role.includes("Developer")) {
        search_keywords += " Engineer"
    }

    if (role.includes("Engineer")) search_keywords += " Developer"

    return search_keywords
}
