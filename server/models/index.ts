'use strict';

import {Sequelize} from 'sequelize';
const env = process.env.NODE_ENV || 'development';

import globalConfig from '../config/config.js';
const config = globalConfig[env];


export const sequelize = new Sequelize(config.database, config.username, config.password, config);

/**
 * We have to verbosely load our models one-by-one at compile time
 * rather than dynamically at runtime, so that typescript can understand them
 */
import userInit, {User} from './user.js';
import roleInit, {Role} from './role.js';
import metaInit, {Meta} from "./meta.js";
import locationInit, {Location} from "./location.js";
import jobMetaInit, {JobMeta} from "./job_meta.js";
import jobInit, {Job} from "./job.js";
import companyInit, {Company} from "./company.js";
import renderCacheStoreInit, {RenderCacheStore} from "./render_cache.js";
import crawlInit, {Crawl} from './crawl.js';

userInit(sequelize);
roleInit(sequelize);
metaInit(sequelize);
locationInit(sequelize);
jobMetaInit(sequelize);
jobInit(sequelize);
companyInit(sequelize);
renderCacheStoreInit(sequelize);
crawlInit(sequelize);

export const models = {
    User,
    Role,
    Meta,
    Location,
    JobMeta,
    Job,
    Company,
    RenderCacheStore,
    Crawl
};

