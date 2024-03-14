'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Location', {
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
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'location',
        indexes: [
        ]
    })
};
