'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('JobMeta', {
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        meta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'job_meta',
        indexes: [
            {   //Speed for joins from job table
                unique: false,
                fields: ['job_id'],
                name: 'job_id_index'
            },
        ]
    })
};
