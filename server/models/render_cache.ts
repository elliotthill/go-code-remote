'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";

export class RenderCacheStore extends Model<InferAttributes<RenderCacheStore>, InferCreationAttributes<RenderCacheStore>> {

    declare id: string;
    declare html: string

}

export default function (sequelize : Sequelize) {

    RenderCacheStore.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        html: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
    },{
        tableName:'render_cache',
        timestamps: false,
        underscored: true,
        sequelize
    });
}
