'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location>> {

    declare id: CreationOptional<number>;
    declare location: string;
    declare state: string;
    declare country: string;
    declare currency: string;
}

export default function (sequelize : Sequelize) {

    Location.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currency: {
            type: DataTypes.STRING(2),
            allowNull: true
        },
    },{
        tableName:'location',
        timestamps: false,
        underscored: true,
        indexes: [
        ],
        sequelize
    });
}
