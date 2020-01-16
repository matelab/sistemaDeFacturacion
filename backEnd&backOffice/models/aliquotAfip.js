module.exports = (sequelize, DataTypes) => {
  // WARNING: DO NOT USE afipAlicuota AS THE NAME OF THE MODEL.
  const AliquotAfip = sequelize.define(
    'aliquotAfip',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idAFIPAlicuota',
        autoIncrement: true,
        primaryKey: true
      },
      percentage: {
        type: DataTypes.FLOAT,
        field: 'porcentaje',
        allowNull: false
      }
    },
    {
      tableName: 'AFIPAlicuota',
      timestamps: false
    }
  );

  AliquotAfip.associate = models => {
    AliquotAfip.hasOne(models.receiptDetail);
  };

  return AliquotAfip;
};
