module.exports = class ApplicationPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record && this.record.userId == this.user.id;
  }

  _isPremium() {
    return this.user.role == "premium";
  }

  _isAdmin() {
    return this.user.role == "admin";
  }

  _isStandard() {
    return this.user.role == "standard";
  }

  _isPrivate() {
    return this.record.private;
  }

  new() {
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
