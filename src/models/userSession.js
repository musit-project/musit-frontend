/* @flow */
import Actor from './actor';
import MuseumId from './museumId';
import Group from './group';

class UserSession {
  accessToken: string;
  groups: ?Group[];
  actor: ?Actor;
  museumId: ?MuseumId;

  constructor(accessToken: string, groups: ?Group[], actor: ?Actor, museumId: ?MuseumId) {
    this.accessToken = accessToken;
    this.groups = groups;
    this.actor = actor;
    this.museumId = museumId;
  }
}

export default UserSession;