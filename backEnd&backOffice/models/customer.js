const validators = require('../utils/validators');
const UniquenessError = require('../errors/uniquenessError');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'customer',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'idCliente',
        autoIncrement: true,
        primaryKey: true,
        validate: {
          isNumeric: true
        }
      },
      taxConditionId: {
        type: DataTypes.INTEGER,
        field: 'idCondicionImpositiva',
        validate: {
          isNumeric: true
        }
      },
      businessName: {
        type: DataTypes.STRING,
        field: 'razonSocial',
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'nombre',
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'apellido',
        allowNull: true,
        validate: {
          notEmpty: true
        }
      },
      cuit: {
        type: DataTypes.BIGINT,
        field: 'cuit',
        allowNull: false,
        validate: {
          isNumeric: true,
          isCuit: validators.cuit
        }
      },
      isLegalPerson: {
        type: DataTypes.BOOLEAN,
        field: 'esPersonaJuridica',
        allowNull: false
      },
      isBilleable: {
        type: DataTypes.BOOLEAN,
        field: 'esFacturable',
        allowNull: false
      },
      isEstatal: {
        type: DataTypes.BOOLEAN,
        field: 'esGubernamental',
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        field: 'activo',
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'Cliente',
      hasTrigger: true,
      timestamps: true,
      paranoid: true,
      defaultScope: {
        where: {
          active: true
        }
      },
      validate: {
        personType: function() {
          if (!this.isLegalPerson && (!this.firstName || !this.lastName)) {
            throw new Error(
              'Being a physical person, first and last name must be defined'
            );
          }
        }
      }
    }
  );

/*   Customer.hook('beforeValidate', customer => {
    if (!customer.isLegalPerson) {
      customer.businessName = `${customer.firstName} ${customer.lastName}`;
    }
  });

  Customer.hook('beforeCreate', async customer => {
    if (await Customer.exist(customer.cuit)) {
      throw new UniquenessError(
        `Ya existe un cliente registrado con el CUIL/CUIT: ${customer.cuit}`
      );
    }
  }); */

  Customer.associate = models => {
    Customer.hasMany(models.customerContact, { as: 'contacts' });
    Customer.hasMany(models.customerAddress, { as: 'addresses' });
    Customer.belongsTo(models.taxCondition);
  };

  Customer.exist = async cuit => await Customer.count({ where: { cuit } });

  return Customer;
};
