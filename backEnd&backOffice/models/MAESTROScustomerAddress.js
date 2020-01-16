const validators = require('../utils/validators');

module.exports = (sequelize, DataTypes) => {
  const CustomerAddress = sequelize.define(
    'MAESTROScustomerAddress',
    { 
       id: {
            type: DataTypes.INTEGER,
            field: 'IdDomicilio',
            autoIncrement: true,
            primaryKey: true,
            validate: {
              isNumeric: true
            }
        },
        customerId: {
        type: DataTypes.INTEGER,
        field: 'IdCliente',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      street: {
        type: DataTypes.STRING(100),
        field: 'Direccion',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      flat: {
        type: DataTypes.STRING(10),
        field: 'Dpto',
        validate: {
          len: [0, 10]
        }
      },
      floor: {
        type: DataTypes.STRING(10),
        field: 'Piso',
        validate: {
          len: [0, 10]
        }
      },
      zipCode: {
        type: DataTypes.STRING(10),
        field: 'CodPostal',
        allowNull: false,
        validate: {
          notEmpty: true,
          isCpa: validators.cpa
        }
      },
      telephone: {
        type: DataTypes.INTEGER,
        field: 'Telefono',
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },

      locality: {
        type: DataTypes.STRING(50),
        field: 'Localidad',
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING(50),
        field: 'Provincia',
        allowNull: false,
      },
      streetNumber: {
        type: DataTypes.INTEGER,
        field: 'Nro',
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },
      observations: {
        type: DataTypes.STRING,
        field: 'observacion'
      }
    },
    
    {
      tableName: 'MAEr_dCliente_dDomicilioFacturable',
      hasTrigger: true,
      timestamps: false,
      paranoid: false
    }
  );


  return CustomerAddress;
};
