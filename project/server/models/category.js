"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
      Category.hasMany(models.Expense)
    }
  }
  Category.init(
    {
      category_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  )
  return Category
}
