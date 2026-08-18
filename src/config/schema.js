import { DataTypes } from 'sequelize';
import sequelize from './database.js';

async function synchronizeDatabase() {
  await sequelize.sync();

  // sync() creates new tables, but it does not alter an existing products table.
  // Keep these additive changes explicit for deployments with an existing database.
  const queryInterface = sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable('products');

  if (!columns.brand_id) {
    await queryInterface.addColumn('products', 'brand_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'brands', key: 'id' },
    });
  }

  const stock = columns.stock;
  if (stock && (!stock.allowNull || stock.defaultValue != null)) {
    await queryInterface.changeColumn('products', 'stock', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  }
}

export default synchronizeDatabase;
