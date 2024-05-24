'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export class Crawl extends Model<InferAttributes<Crawl>,
    InferCreationAttributes<Crawl>> {

    declare url: string;
    declare html: string;
    declare status_code: number;
    declare updated: number;
    declare created: number;

}

export default function (sequelize : Sequelize) {

    Crawl.init({
        url: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        html: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        status_code: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },{
        tableName:'crawl',
        timestamps: false,
        underscored: true,
        indexes: [
        ],
        sequelize
    });
}
