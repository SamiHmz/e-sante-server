module.exports = (sequelize, DataTypes) => {
  var Comune = sequelize.define(
    "Comune",
    {
      code_postal: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },

    { tableName: "comune", timestamps: false }
  );
  Comune.associate = function (models) {
    models.Comune.belongsTo(models.Wilaya, { foreignKey: "wilaya_id" });
    models.Comune.hasMany(models.User, { foreignKey: "comune_id" });
  };
  return Comune;
};
