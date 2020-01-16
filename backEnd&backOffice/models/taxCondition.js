module.exports = (sequelize, DataTypes) => {
  const TaxCondition = sequelize.define(
    'taxCondition',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idCondicionImpositiva',
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
      },
      receiptCharacter: {
        type: DataTypes.STRING(1),
        field: 'letraComprobante',
        allowNull: false,
        set: function(value) {
          this.setDataValue('receiptCharacter', value.toUpperCase());
        },
        validate: {
          notEmpty: true,
          isUppercase: true,
          type: DataTypes.STRING(1)
        }
      }
    },
    {
      tableName: 'CondicionImpositiva',
      hasTrigger: true,
      timestamps: false
    }
  );

  TaxCondition.associate = models => {
    TaxCondition.hasMany(models.customer);
  };

  return TaxCondition;
};
