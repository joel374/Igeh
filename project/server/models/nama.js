"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Nama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Nama.belongsTo(models.User)
      // Nama.belongsTo(models.Nama)
    }
  }
  Nama.init(
    {
      image_url: DataTypes.STRING,
      caption: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Nama",
    }
  )
  return Nama
}
