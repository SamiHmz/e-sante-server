module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
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
        allowNull: false,
        unique: true,
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
    },
    { tableName: "utilisateur", timestamps: false }
  );
  User.associate = function (models) {
    models.User.belongsTo(models.Comune, { foreignKey: "comune_id" });
    models.User.hasMany(models.Demande, { foreignKey: "user_id" });
  };

  return User;
};
