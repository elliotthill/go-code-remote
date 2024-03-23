import { QueryTypes } from "sequelize";

export class JobListFilter {

    private where_clause: string;
    private order_clause: string;

    private fuzzy_keywords: string | null = null;
    private keywords: string | null = null;
    private location_filter: number | null = null;
    private limit  = 25;
    private offset = 0;

    private db:any; //replace with db interface

    constructor(db:any) {
        this.db = db;

        this.where_clause = "";
        this.order_clause = "created DESC";
    }

    set_full_text_search(keywords: string) {

        this.where_clause += " AND (MATCH(search_keywords) AGAINST(:keywords IN NATURAL LANGUAGE MODE) OR search_keywords LIKE :fuzzy_keywords) ";
        this.fuzzy_keywords  = `%${this.fuzzy_keywords}%`; //It will be escaped don't worry
        this.keywords = keywords;
    }

    set_location_filter(location_filter: number) {
        this.location_filter = location_filter;
        this.where_clause += " AND location.id = :location_id ";
    }

    set_location_US() {
        this.where_clause += " AND location.country = 'US' ";
    }
    set_location_UK() {
        this.where_clause += " AND location.country = 'UK' ";
    }
    set_location_CA() {
        this.where_clause += " AND location.country = 'CA' ";
    }
    set_location_europe() {
        this.where_clause += " AND location.currency = '€' ";
    }
    set_location_california(){
        this.where_clause += " AND location.state = 'CA' ";
    }
    set_location_texas() {
        this.where_clause += " AND location.state = 'TX' ";
    }

    set_experience_filter(experience_filters: string[]) {
        this.where_clause += ` AND job.experience IN(${experience_filters.join(',')}) `; //Doesnt contain user input
    }

    static sort_opts:{[key: string]: string} = {
        money: "rate DESC",
        rating: "company.glassdoor DESC",
    }

    set_sort(sort: string) {
        this.order_clause = JobListFilter.sort_opts[sort];
    }

    set_remote_only() {
        this.where_clause += " AND (job.remote = 'remote' OR job.remote = 'remote domestic') ";
    }

    set_page(page: number, posts_per_page: number) {
        this.limit = posts_per_page;
        this.offset = (page - 1) * posts_per_page;
    }

    get_results() {

        return this.db.query(`
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
                             WHERE status='live' ${this.where_clause}
                             GROUP BY job.role_id, job.company_id
                             ORDER BY ${this.order_clause}
                             LIMIT :limit OFFSET :offset
                             `, {
                                 replacements: {
                                     location_id: this.location_filter,
                                     fuzzy_keywords: this.fuzzy_keywords,
                                     keywords: this.keywords,
                                     limit: this.limit,
                                     offset: this.offset,
                                 },
                                 type: QueryTypes.SELECT,
                             });


    }

}

