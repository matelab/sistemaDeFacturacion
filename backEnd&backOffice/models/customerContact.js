module.exports = (sequelize, DataTypes) => {
  const CustomerContact = sequelize.define(
    'customerContact',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idDatosContacto',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'idCliente',
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      email: {
        type: DataTypes.STRING(150),
        field: 'email',
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      telephonePrefix: {
        type: DataTypes.STRING(8),
        field: 'prefijo',
        validate: {
          isNumeric: true,
          len: [0, 8]
        }
      },
      telephone: {
        type: DataTypes.INTEGER,
        field: 'numero',
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
      tableName: 'ClienteDatosContacto',
      hasTrigger: true,
      timestamps: true,
      paranoid: true
    }
  );

  CustomerContact.associate = models => {
    CustomerContact.belongsTo(models.customer);
  };

  return CustomerContact;
};
