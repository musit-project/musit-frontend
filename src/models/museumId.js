/* @flow */

class MuseumId {
  museumId: number;

  constructor(museumId: number) {
    this.museumId = museumId;
  }

  getQuery() {
    return `museumId=${this.museumId}`;
  }

  getPath() {
    return `museum/${this.museumId}`;
  }
}

export default MuseumId;