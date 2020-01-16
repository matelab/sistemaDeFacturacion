const validators = require('../utils/validators');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'customer',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'IdCliente',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      isEstatal: {
        type: DataTypes.BOOLEAN,
        field: 'Gobierno',
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        field: 'Activo',
        allowNull: false,
        defaultValue: true
    },
      businessName: {
        type: DataTypes.STRING,
        field: 'RazonSocial',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      cuit: {
        type: DataTypes.BIGINT,
        field: 'CUIT',
        allowNull: false,
        validate: {
          isNumeric: true,
          isCuit: validators.cuit
        }
      },
      isBilleable: {
        type: DataTypes.BOOLEAN,
        field: 'Facturable',
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'Nombres',
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'Apellido',
        allowNull: true,
      }
    },
 
    {
      tableName: 'MAEdCliente',
      hasTrigger: true,
      timestamps: false,
      paranoid: false
    }
  );

  return Customer;
};
