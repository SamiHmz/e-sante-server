module.exports = (sequelize, DataTypes) => {
  var Consultation = sequelize.define(
    "Consultation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      diagnostic: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
      traitemnet: {
        type: DataTypes.STRING,
        validate: {
          allowNull: false,
          notEmpty: true,
        },
      },
    },
    { tableName: "consultation" }
  );

  Consultation.associate = function (models) {
    models.Consultation.belongsTo(models.Medecin, {
      foreignKey: { name: "medecin_id" },
    });
    models.Consultation.belongsTo(models.User, {
      foreignKey: { name: "user_id" },
    });
  };

  return Consultation;
};
