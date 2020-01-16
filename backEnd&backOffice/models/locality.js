module.exports = (sequelize, DataTypes) => {
  const Locality = sequelize.define(
    'locality',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idLocalidad',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      name: {
        type: DataTypes.STRING(50),
        field: 'nombre',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      zipCode: {
        type: DataTypes.INTEGER,
        field: 'codigoPostal',
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
      }
    },
    {
      tableName: 'Localidad',
      timestamps: false
    }
  );

  return Locality;
};
