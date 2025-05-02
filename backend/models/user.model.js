import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        rol: {
            type: DataTypes.ENUM("admin", "supervisor", "jefe_turno", "tecnico"),
            allowNull: false,
            defaultValue: "tecnico",
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "usarios",
        timestamps: false,
    }
);

export default User;