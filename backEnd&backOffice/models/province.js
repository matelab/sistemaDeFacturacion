module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    'province',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idProvincia',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      code: {
        type: DataTypes.STRING(1),
        field: 'caracter',
        allowNull: false,
        set: function(value) {
          this.setDataValue('code', value.toUpperCase());
        },
        validate: {
          notEmpty: true,
          isUppercase: true,
          len: [1, 1]
        }
      },
      name: {
        type: DataTypes.STRING(50),
        field: 'nombre',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      tableName: 'Provincia',
      timestamps: false
    }
  );



  return Province;
};
