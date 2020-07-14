module.exports = (sequelize, DataTypes) => {
  var Demande = sequelize.define(
    "Demande",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      symptomes: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      autre_symptomes: {
        type: DataTypes.STRING,
      },
      traitement: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      is_treated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { tableName: "demande" }
  );

  Demande.associate = function (models) {
    models.Demande.belongsTo(models.Medecin, {
      foreignKey: { name: "medecin_id" },
    });
    models.Demande.belongsTo(models.User, {
      foreignKey: { name: "user_id" },
    });
  };

  return Demande;
};
