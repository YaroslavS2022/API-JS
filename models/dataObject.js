const Record = require('./record');

class DataObject {
  constructor(id, records) {
    this.id = id;
    this.records = records;
  }
}

module.exports = DataObject;
