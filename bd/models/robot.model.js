import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const Robot = sequelize.define("Robot",
    {
        modelo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ubicacion_actual: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado_actual: {
            type: DataTypes.ENUM("operativo", "en_reparacion", "fuera_servicio"),
            allowNull: false,
            defaultValue: "operativo",
        },
    },
    {
        tableName: "robots",
        timestamps: false,
    }
);

export default Robot;