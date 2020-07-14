module.exports = (sequelize, DataTypes) => {
  var Specialite = sequelize.define(
    "Specialite",
    {
      nom: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "specialite", timestamps: false }
  );

  Specialite.associate = function (models) {
    models.Specialite.hasMany(models.Medecin, { foreignKey: "specialite_id" });
  };

  return Specialite;
};
