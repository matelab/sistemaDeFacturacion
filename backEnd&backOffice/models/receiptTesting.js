const moment = require('moment');
const helpers = require('../utils/helpers');

module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define(
    'receipt',
    {
      receiptId: {
        type: DataTypes.INTEGER,
        field: 'idComprobante',
        primaryKey: true,
        autoIncrement: true,
        validate: {
          isNumeric: true
        }
      },
      receiptTypeId: {
        type: DataTypes.INTEGER,
        field: 'idTipoComprobante',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      taxConditionId: {
        type: DataTypes.INTEGER,
        field: 'idCondicionImpositiva',
        allowNull: false,
        primaryKey: true
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'idCliente',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      sellingPoint: {
        type: DataTypes.INTEGER,
        field: 'puntoDeVenta',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      receiptNumber: {
        type: DataTypes.INTEGER,
        field: 'nroComprobante',
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },
      cae: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'cae'
      },
      dateDone: {
        type: DataTypes.DATEONLY,
        field: 'FechaRealizado',
        validate: {
          isDate: true
        }
      },
      dateImputed: {
        type: DataTypes.DATEONLY,
        field: 'FechaImputable',
        validate: {
          isDate: true
        }
      },
      gross: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'PrecioBruto',
        allowNull: false
      },
      net: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'PrecioNeto',
        allowNull: false
      },
      total: {
        type: DataTypes.DECIMAL(18, 2),
        field: 'PrecioTotal',
        allowNull: false
      },
      iibb: {
        type: DataTypes.DECIMAL(4, 2),
        field: 'IIBB',
        allowNull: false
      },
      payCondition: {
          type: DataTypes.STRING(50),
          field: 'CondicionCobro',
          allowNull: true
      },
      entity: {
        type: DataTypes.STRING(40),
        field: 'Entidad',
        allowNull: true
      },
      currencyId: {
        type: DataTypes.INTEGER,
        field: 'idMoneda',
        allowNull: true,
        validate: {
            isNumeric: true
          }
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(10,3),
        field: 'Cotizacion',
        allowNull: true
      },
      observations: {
        type: DataTypes.STRING,
        field: 'Observaciones',
        allowNull: true
      },
    },
    {
      tableName: 'ComprobanteTesting',
      timestamps: false
    }
  );

  Receipt.associate = models => {
    Receipt.hasMany(models.receiptDetail);
    Receipt.belongsTo(models.receiptType);
    Receipt.belongsTo(models.customer);
    // Receipt.hasOne(models.valorization);
    // Receipt.hasOne(models.movement);
    // Receipt.hasOne(models.paymentReceipt);
  };



  return Receipt;
};
