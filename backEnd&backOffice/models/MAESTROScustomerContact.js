module.exports = (sequelize, DataTypes) => {
    const CustomerContact = sequelize.define(
      'customerContact',
      {
        id: {
          type: DataTypes.INTEGER,
          field: 'IdContacto',
          autoIncrement: true,
          primaryKey: true,
          validate: {
            isNumeric: true
          }
        },
        customerId: {
          type: DataTypes.INTEGER,
          field: 'IdCliente',
          allowNull: false,
          validate: {
            isNumeric: true
          }
        },
        email: {
          type: DataTypes.STRING(150),
          field: 'Email',
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        telephone: {
          type: DataTypes.INTEGER,
          field: 'Telefono',
          allowNull: false,
          validate: {
            isNumeric: true
          }
        },
        telephoneIntern: {
          type: DataTypes.STRING(8),
          field: 'interno',
          validate: {
            isNumeric: true,
            len: [0, 8]
          }
        }
      },
      {
        tableName: 'MAEr_dCliente_dContactoComercial',
        hasTrigger: true,
        timestamps: false,
        paranoid: false
      }
    );
  
    CustomerContact.associate = models => {
      CustomerContact.belongsTo(models.customer);
    };
  
    return CustomerContact;
  };
  