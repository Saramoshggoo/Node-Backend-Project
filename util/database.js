const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// linko az mongodb atlas 
// bayad dokhle function benevisim bad export konim
let _db;
const mongoConnect = callback => {
  MongoClient.connect(
  
    'mongodb+srv://moshggoo:27march85@cluster0.iaaor.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log('Connected!');
      //coonect db in _db varibale
      _db= client.db()
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
//bayad vase connection in modeli benevism 
const getDb=()=>{
  if (_db){
    return _db;
  }
  throw 'no database found'
}

exports. mongoConnect=mongoConnect;
exports.getDb=getDb;

