import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";
import Robot from "./robot.model.js";


const estadosPermitidos = ["operativo", "en_reparacion", "fuera_servicio"];

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
        detalle_robots: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            validate: {
                esValido(value) {
                const estadosPermitidos = ["operativo", "en_reparacion", "fuera_servicio"];

                if (!Array.isArray(value)) {
                    throw new Error("detalle_robots debe ser un arreglo");
                }

                for (const robot of value) {
                    if (
                    typeof robot !== "object" ||
                    !robot.id ||
                    !estadosPermitidos.includes(robot.estado)
                    ) {
                    throw new Error(`Cada robot debe tener un id y un estado válido (${estadosPermitidos.join(", ")})`);
                    }
                }
                }
            }
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

async function validarDetalleRobots(incident, options) {
  const detalle = incident.detalle_robots || [];

  if (!Array.isArray(detalle)) {
    throw new Error("detalle_robots debe ser un arreglo");
  }

  for (const robot of detalle) {
    if (
      typeof robot !== "object" ||
      typeof robot.id !== "number" ||
      !estadosPermitidos.includes(robot.estado)
    ) {
      throw new Error(`Cada robot debe tener un id numérico y un estado válido (${estadosPermitidos.join(", ")})`);
    }
  }

  // Validar existencia de los IDs en la base de datos
  const ids = detalle.map(r => r.id);
  const existentes = await Robot.findAll({
    where: { id: ids },
    transaction: options.transaction,
  });

  if (existentes.length !== ids.length) {
    throw new Error("Uno o más IDs de robots no existen");
  }
}

Incident.beforeCreate(validarDetalleRobots);
Incident.beforeUpdate(validarDetalleRobots);

Incident.afterCreate(async (incident, options) => {
    const codigo = `INC-${String(incident.id).padStart(3, '0')}`;
    if (!incident.codigo) {
      incident.codigo = codigo;
      await incident.save({ transaction: options.transaction });
    }
  });

export default Incident;