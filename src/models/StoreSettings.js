import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StoreSettings = sequelize.define(
  'StoreSettings',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    store_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true },
    },
    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { isUrlOrDataUrl(value) {
        if (value && !/^(https?:\/\/|data:image\/)/i.test(value)) {
          throw new Error('logo_url debe ser una URL HTTP(S) o una imagen data URL.');
        }
      } },
    },
    primary_color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#d99000',
      validate: { is: /^#[0-9a-f]{6}$/i },
    },
    secondary_color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#181818',
      validate: { is: /^#[0-9a-f]{6}$/i },
    },
    whatsapp_number: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    secondary_whatsapp: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING(160),
      allowNull: true,
      validate: { isEmail: true },
    },
  },
  {
    tableName: 'store_settings',
    underscored: true,
  },
);

export default StoreSettings;
