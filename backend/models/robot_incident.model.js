import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import Robot from "./robot.model.js";
import Incident from "./incident.model.js";


const RobotIncident = sequelize.define("RobotIncident",
    {
        robot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Robot, // nombre de la tabla referenciada
                key: "id",        // columna referenciada
              },
        },
        incidente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Incident, // nombre de la tabla referenciada
                key: "id",        // columna referenciada
              },
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
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "incidente_robot",
        timestamps: false,
    }
);

export default RobotIncident;