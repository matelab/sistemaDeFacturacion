const validators = require('../utils/validators');

module.exports = (sequelize, DataTypes) => {
  const CustomerAddress = sequelize.define(
    'customerAddress',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idClienteDomicilio',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'idCliente',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      addressTypeId: {
        type: DataTypes.INTEGER,
        field: 'idTipoDomicilio',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      provinceId: {
        type: DataTypes.INTEGER,
        field: 'idProvincia',
        allowNull: false,
        
        validate: {
          isNumeric: true
        }
      },
      localityId: {
        type: DataTypes.INTEGER,
        field: 'idLocalidad',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      street: {
        type: DataTypes.STRING(100),
        field: 'calle',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      streetNumber: {
        type: DataTypes.INTEGER,
        field: 'numero',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      tower: {
        type: DataTypes.STRING(10),
        field: 'torre',
        validate: {
          len: [0, 10]
        }
      },
      floor: {
        type: DataTypes.STRING(10),
        field: 'piso',
        validate: {
          len: [0, 10]
        }
      },
      flat: {
        type: DataTypes.STRING(10),
        field: 'departamento',
        validate: {
          len: [0, 10]
        }
      },
      zipCode: {
        type: DataTypes.STRING(50),
        field: 'cpa',
        allowNull: false,
        validate: {
          notEmpty: true,
          isCpa: validators.cpa
        }
      },
      observations: {
        type: DataTypes.STRING,
        field: 'observaciones'
      }
    },
    {
      tableName: 'ClienteDomicilio',
      hasTrigger: true,
      timestamps: true,
      paranoid: true
    }
  );


  return CustomerAddress;
};
