module.exports = (sequelize, DataTypes) => {
  var Medecin = sequelize.define(
    "Medecin",
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      numero: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isNumeric: true,
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      pass: DataTypes.STRING,
      pass_text: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    { tableName: "medecin", timestamps: false }
  );
  Medecin.associate = function (models) {
    models.Medecin.belongsTo(models.Specialite, {
      foreignKey: "specialite_id",
    });
    models.Medecin.hasMany(models.Demande, { foreignKey: "medecin_id" });
  };

  return Medecin;
};
