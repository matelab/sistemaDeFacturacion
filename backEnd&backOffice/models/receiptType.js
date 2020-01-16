module.exports = (sequelize, DataTypes) => {
  const ReceiptType = sequelize.define(
    'receiptType',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idTipoComprobante',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      description: {
        type: DataTypes.STRING,
        field: 'descripcion',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      tableName: 'TipoComprobante',
      hasTrigger: true,
      timestamps: false
    }
  );



  return ReceiptType;
};
