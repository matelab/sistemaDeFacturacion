const validators = require('../utils/validators');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      idUser: {
        type: DataTypes.INTEGER,
        field: 'idUsuario',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      email: {
        type: DataTypes.STRING,
        field: 'Email',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      active: {
        type: DataTypes.INTEGER,
        field: 'Activo',
        allowNull: true,
        validate: {
          isNumeric: true,
        }
      }
    },
 
    {
      tableName: 'FM_Usuarios',
      hasTrigger: true,
      timestamps: false,
      paranoid: false
    }
  );

  return Users;
};
