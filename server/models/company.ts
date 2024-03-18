'use strict';

export default  function (sequelize, DataTypes) {
    return sequelize.define('Company', {
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

    }, {
        timestamps: false,
        underscored: true,
        tableName: 'company',
        indexes: [
        ]
    })
};
