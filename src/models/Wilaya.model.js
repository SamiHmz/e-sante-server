module.exports = (sequelize, DataTypes) => {
  var Wilaya = sequelize.define(
    "Wilaya",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "wilaya", timestamps: false }
  );

  Wilaya.associate = function (models) {
    models.Wilaya.hasMany(models.Comune, { foreignKey: "wilaya_id" });
  };

  return Wilaya;
};
