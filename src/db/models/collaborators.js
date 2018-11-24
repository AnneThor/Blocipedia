'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborators = sequelize.define('Collaborators', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Collaborators.associate = function(models) {
    // associations can be defined here
    Collaborators.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Collaborators.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE",
    });
  };

  Collaborators.addScope("collabs", (userId) => {
    return {
      where: {userId: userId},
      order: [["createdAt", "DESC"]],
    }
  });


  return Collaborators;
};
