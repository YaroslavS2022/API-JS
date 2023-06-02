const Record = require('./record');
const DataObject = require('./dataObject');

// Example usage
const record1 = new Record(1, 'qwe1', 'qwe2', 'qwe3');
const record2 = new Record(2, 'rty1', 'rty2', 'rty3');
const records = [record1, record2];

const dataObject = new DataObject(1, records);

console.log(dataObject);
