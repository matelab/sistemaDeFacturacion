module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define(
      'currency',
      {
        id: {
          type: DataTypes.INTEGER,
          field: 'idMoneda',
          autoIncrement: true,
          primaryKey: true,
          validate: {
            isNumeric: true
          }
        },
        currency: {
          type: DataTypes.STRING(50),
          field: 'Moneda',
          allowNull: false,
        },
        idAFIPcurrency: {
          type: DataTypes.STRING(4),
          field: 'idMonedaAFIP',
          allowNull: true,
        },
      },
      {
        tableName: 'Moneda',
        timestamps: false
      }
    );
  
 
    return Currency;
  };
  