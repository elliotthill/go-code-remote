'use strict';

export default  function (sequelize, DataTypes) {
    return sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'role',
        indexes: [
        ]
    })
};
