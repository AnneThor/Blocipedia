const ApplicationPolicy = require("./application");
const collabQueries = require("../db/queries.collaborators.js");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

  //only show wikis that you are a collaborator on
  //if you are a standard user you can see private wikis you're collaborating on
  //private wikis visible to user, admin, and collaborators

  //has USER and RECORD

  _isCollaborator() {
    return collabQueries.isCollab(this.user.id, this.record.id, collab => {
      if (!collab) {
        return false;
      } else {
        return true;
      }
    });
  }

}
