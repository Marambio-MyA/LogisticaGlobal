import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const RobotIncident = sequelize.define("RobotIncident",
    {
        robot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        incidente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado_final_robot: {
            type: DataTypes.ENUM("operativo", "en_reparacion", "fuera_servicio"),
            allowNull: false,
            defaultValue: "operativo",
        },
        trabajo_realizado: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reportado_por: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fecha_cierre: {
            type: DataTypes.TIMESTAMP,
            allowNull: true,
        },
    },
    {
        tableName: "incidente_robot",
        timestamps: false,
    }
);

export default RobotIncident;