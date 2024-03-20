'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

export class Meta extends Model<InferAttributes<Meta>, InferCreationAttributes<Meta>> {

    declare id: CreationOptional<number>;
    declare type: DataTypes.EnumDataType<string>;
    declare value: string

}

export default function (sequelize : Sequelize) {

    Meta.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('lang', 'infra', 'framework', 'remote', 'other'),
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        tableName:'meta',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['type','value'],
                name: 'type_value_unique'
            }
        ],
        sequelize
    });
}
