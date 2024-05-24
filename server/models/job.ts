"use strict"

import {Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional} from "sequelize"

export class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    declare id: CreationOptional<number>
    declare company_id: number
    declare location_id: number
    declare role_id: number
    declare title: string
    declare department: string
    declare created: string
    declare updated: string
    declare source_url: string
    declare type: string
    declare rate: number
    declare search_keywords: string
    declare remote: string
    declare more_jobs: number
    declare status: string
    declare experience: string
    declare dead: boolean
}

export default function (sequelize: Sequelize) {
    Job.init(
        {
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
                allowNull: true
            },
            source_url: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM("permanent", "contract"),
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
                type: DataTypes.ENUM("remote", "remote us", "hybrid", "in-office"),
                allowNull: false
            },
            more_jobs: {
                type: DataTypes.SMALLINT.UNSIGNED,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM("live", "draft", "trashed"),
                allowNull: false,
                defaultValue: "live"
            },
            experience: {
                type: DataTypes.ENUM("entry", "mid", "senior"),
                allowNull: false,
                defaultValue: "mid"
            },
            dead: {
                type: DataTypes.BOOLEAN(),
                allowNull: false,
                defaultValue: false
            }
        },
        {
            timestamps: false,
            underscored: true,
            tableName: "job",
            indexes: [
                {
                    unique: true,
                    fields: ["company_id", "location_id", "role_id"],
                    name: "company_location_role"
                }
                /*{
                    unique: true,
                    fields: ["source_url"],
                    name: "link_unique"
                }*/
            ],
            sequelize
        }
    )
}
