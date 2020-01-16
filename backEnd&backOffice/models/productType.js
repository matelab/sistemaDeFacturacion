module.exports = (sequelize, DataTypes) => {
  // NO USAR productType COMO NOMBRE PORQUE HAY CONFLICTO DE NOMBRES. RAZON DESCONOCIDA.
  const TypeofProduct = sequelize.define(
    'TypeofProduct',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idTipoProducto',
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
      tableName: 'TipoProducto',
      timestamps: false
    }
  );

  return TypeofProduct;
};
