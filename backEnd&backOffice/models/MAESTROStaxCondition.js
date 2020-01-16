module.exports = (sequelize, DataTypes) => {
    const TaxCondition = sequelize.define(
      'taxCondition',
      {
        id: {
            type: DataTypes.INTEGER,
            field: 'IdImpuesto',
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            validate: {
              isNumeric: true
            }
          },
          description: {
            type: DataTypes.STRING(50),
            field: 'Descripcion',
          },
          percentage: {
            type: DataTypes.INTEGER,
            field: 'Porcentaje',
            validate: {
                isNumeric: true
            }
        }
//HAY MAS COLUMNAS PERO NO SIRVEN
      },
      {
        tableName: 'MAEsImpuestos',
        hasTrigger: true,
        timestamps: false,
        paranoid: false
      }
    );
  
  
    return TaxCondition;
  };
  