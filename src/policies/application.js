collabQueries = require("../db/queries.collaborators.js");

module.exports = class ApplicationPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isAdmin() { //there must be a user and user must be an admin
    return this.user && this.user.role == "admin";
  }

  _isCollaborator() {
    if (!user || !record) {
      return false;
    }
    return collabQueries.isCollab(user.id, record.id, collab => {
      if (!collab) {
        return false;
      } else {
        return true;
      }
    });
  }

  _isOwner() { //must be a user, must be a record, user ids must match
    return this.user && this.record && this.record.userId == this.user.id;
  }

  _isPremium() { //there must be a user and user must be a premium user
    return this.user.role == "premium";
  }

  _isStandard() { //there must be a user and user must be standard
    return this.user && this.user.role == "standard";
  }

  _isPrivate() { //there must be a record and check if it is private
    return this.record && this.record.private;
  }

  new() { //there must be a user
    return this.user != null;
  }

  create() {
    return this.new();
  }

  edit() {
    if (!this.record || !this.user) {
      return false;
    } else if (this.record.private) {
      return this.record.userId == this.user.id;
    } else {
      return true; //it was a public record
    }
  }

  update() {
    return this.edit();
  }

  destroy() {
    if (!this.user || !this.record) {
      return false
    } else {
      return this.user.id == this.record.userId;
    }
  }

}
