'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {

    declare id: CreationOptional<number>;
    declare company: string;
    declare glassdoor: number;
    declare indeed: number;
    declare remote: boolean;
    declare meta: string;
    declare careers_page: string;
}

export default function (sequelize : Sequelize) {

    Company.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        glassdoor: {
            type: DataTypes.FLOAT().UNSIGNED,
            allowNull: true
        },
        indeed: {
            type: DataTypes.FLOAT().UNSIGNED,
            allowNull: true
        },
        remote: {
            type: DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: false
        },
        meta: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        careers_page: {
            type: DataTypes.TEXT,
            allowNull: true
        },

    },{
        tableName:'company',
        timestamps: false,
        underscored: true,
        indexes: [
        ],
        sequelize
    });
}
