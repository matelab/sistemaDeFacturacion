module.exports = (sequelize, DataTypes) => {
  const ReceiptDetail = sequelize.define(
    'receiptDetail',
    {
      detailsId: {
        type: DataTypes.INTEGER,
        field: 'idItem',
        primaryKey: true,
        autoIncrement: true,
        validate: {
          isNumeric: true
        }
      },
      receiptId: {
        type: DataTypes.INTEGER,
        field: 'idComprobante',
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      description: {
        type: DataTypes.STRING,
        field: 'Descripcion',
        allowNull: true,
      },
      productType: {
        type: DataTypes.INTEGER,
        field: 'idTipoProducto',
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'Precio',
        allowNull: false,
        validate: {
          min: 0
        }
      },
      vatId: {
        type: DataTypes.DECIMAL (4,2),
        field: 'idAFIPAlicuota',
        allowNull: true,
        validate: {
          isNumeric: true
        }
      },
      account: {
        type: DataTypes.STRING(50),
        field: 'CuentaContable',
        allowNull: true,
      }
    },
    {
      tableName: 'Item_Comprobante',
      timestamps: false
    }
  );

  ReceiptDetail.associate = models => {
    ReceiptDetail.belongsTo(models.receipt);
    ReceiptDetail.belongsTo(models.aliquotAfip);
  };

  return ReceiptDetail;
};
