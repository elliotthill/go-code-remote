'use strict';

import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {

    declare id: CreationOptional<number>;
    declare role: string;

}

export default function (sequelize : Sequelize) {

    Role.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        tableName:'role',
        timestamps: false,
        underscored: true,
        sequelize
    });
}

