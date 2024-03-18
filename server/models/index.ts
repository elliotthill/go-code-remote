'use strict';

/*
 * Sequelize recommends loading models within index.js here.
 * So you can call model.{AnyModel} without explicitly importing that model.
 * Copied pretty much verbatim from their docs. Typescript not used.
 *
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';

export const models = {};

//These three lines essentially replace __dirname from CJS
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basename = path.basename(filename);

const env = process.env.NODE_ENV || 'development';

import globalConfig from '../config/config.js';
const config = globalConfig[env];


export const sequelize = new Sequelize(config.database, config.username, config.password, config);


(async () => {
    const files = fs
        .readdirSync(dirname)
        .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'));

    await Promise.all(files.map(async (file) => {
        const module = await import(path.join(dirname, file));
        const model = module.default(sequelize, Sequelize);
        models[model.name] = model;
    }));

    Object.keys(models).forEach((modelName) => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });
})();

//export default { models, sequelize, Sequelize };

