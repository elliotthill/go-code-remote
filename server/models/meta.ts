'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Meta', {
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
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'meta',
        indexes: [
            {
                unique: true,
                fields: ['type','value'],
                name: 'type_value_unique'
            }
        ]
    })
};
