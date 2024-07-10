import {Sequelize} from "sequelize"
import db from "../config/Database.js"

const {DataTypes} = Sequelize

const Attendance = db.define('attendance', {
    userId : {
        type: DataTypes.INTEGER,
    },
    employee_id : {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
    },
    day: {
        type: DataTypes.STRING,
    },
    checkinTime: {
        type: DataTypes.STRING,
    },
    checkOutTime: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.STRING,
    },
    OverWork: {
        type: DataTypes.STRING,
    },
    userNote: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true,
    timestamps: true
})

export default Attendance