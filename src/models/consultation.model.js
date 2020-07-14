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
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      traitemnet: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: "consultation" }
  );

  Consultation.associate = function (models) {};

  return Consultation;
};
