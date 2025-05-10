import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";

const Incident = sequelize.define("Incident",
    {
        codigo: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo_incidente: {
            type: DataTypes.ENUM("mecanico", "colision", "software"),
            allowNull: false,
            defaultValue: "mecanico",
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM("creado", "cerrado"),
            allowNull: false,
            defaultValue: "creado",
        },
        creado_por: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // nombre de la tabla referenciada
                key: "id",        // columna referenciada
            },
        },
    },
    {
        tableName: "incidentes",
        timestamps: false,
    }
);

Incident.afterCreate(async (incident, options) => {
    const codigo = `INC-${String(incident.id).padStart(3, '0')}`;
    if (!incident.codigo) {
      incident.codigo = codigo;
      await incident.save({ transaction: options.transaction });
    }
  });

export default Incident;