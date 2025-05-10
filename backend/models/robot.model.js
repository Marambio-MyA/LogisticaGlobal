import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const Robot = sequelize.define("Robot",
    {
        modelo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        identificador: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
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

Robot.afterCreate(async (robot, options) => {
    const identificador = `Robot-${String(robot.id).padStart(3, '0')}`;
    // Evita múltiples updates si el identificador ya está seteado
    if (!robot.identificador) {
      robot.identificador = identificador;
      await robot.save({ transaction: options.transaction }); // importante usar la misma transacción
    }
  });

export default Robot;