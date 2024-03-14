'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Job', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        company_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        source_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('permanent', 'contract'),
            allowNull: false
        },
        rate: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        search_keywords: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        remote: {
            type: DataTypes.ENUM('remote', 'remote us', 'hybrid', 'in-office'),
            allowNull: false
        },
        more_jobs: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('live', 'draft', 'trashed'),
            allowNull: false,
            defaultValue: 'live'
        }

    }, {
        timestamps: false,
        underscored: true,
        tableName: 'job',
        indexes: [
            {
                unique: true,
                fields: ['company_id', 'location_id', 'role_id'],
                name: 'company_location_role'
            }
        ]
    })
};
