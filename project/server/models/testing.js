"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Testing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //   Testing.belongsTo(models.User)
      // Testing.belongsTo(models.Testing)
    }
  }
  Testing.init(
    {
      image_url: DataTypes.STRING,
      caption: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Testing",
    }
  )
  return Testing
}
