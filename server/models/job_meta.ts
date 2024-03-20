'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";

export class JobMeta extends Model<InferAttributes<JobMeta>, InferCreationAttributes<JobMeta>> {

    declare job_id: number;
    declare meta_id: number;
}

export default function (sequelize : Sequelize) {

    JobMeta.init({
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        meta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },{
        tableName:'job_meta',
        timestamps: false,
        underscored: true,
        indexes: [
            {   //Speed for joins from job table
                unique: false,
                fields: ['job_id'],
                name: 'job_id_index'
            },
        ],
        sequelize
    });
}
