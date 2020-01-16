module.exports = (sequelize, DataTypes) => {
  const ReceiptLog = sequelize.define(
    'receiptLog',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idValidacionComprobante',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      receiptId: {
        type: DataTypes.INTEGER,
        field: 'idComprobante',
        validate: {
          isNumeric: true
        }
      },
      request: {
        type: DataTypes.STRING,
        field: 'peticion',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      response: {
        type: DataTypes.STRING,
        field: 'respuesta'
      },
      error: {
        type: DataTypes.STRING,
        field: 'error'
      },
      timestamp: {
        type: DataTypes.DATE,
        field: 'marcatemporal',
        validate: {
          isDate: true
        }
      }
    },
    {
      schema: 'Logs',
      tableName: 'ValidacionComprobanteTesting',
      timestamps: false
    }
  );

  return ReceiptLog;
};
