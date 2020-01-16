//ESTE MODELO PER SE SOLO INDICA EL ID DEL IMPUESTO Y EL DEL CLIENTE, NO LA CONDICIONIMPOSITIVA
module.exports = (sequelize, DataTypes) => {
    const CustomerTax = sequelize.define(
      'customerTax',
      {
        id: {
            type: DataTypes.INTEGER,
            field: 'IdCliente',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            validate: {
              isNumeric: true
            }
          },
        taxId: {
          type: DataTypes.INTEGER,
          field: 'IdImpuesto',
          validate: {
            isNumeric: true
          }
        }
//HAY MAS COLUMNAS PERO NO SIRVEN
      },
      {
        tableName: 'MAEr_dCliente_dImpuesto',
        hasTrigger: true,
        timestamps: false,
        paranoid: false
      }
    );

  
    return CustomerTax;
  };
  