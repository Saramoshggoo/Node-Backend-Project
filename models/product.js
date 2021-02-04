const mongodb = require('mongodb');
//call get function to access to database
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId=userId;
    this._id =id ?new mongodb.ObjectId (id):null;
  
  }

  save() {
   
    const db = getDb();
    let dbOp;
    if (this._id) {
        //second argument baraye update niyaz darim y mitoonim benevism this age ahme filed avaz mishe 
      //ya mitoonim specific begim kodom 
      // Update the product
      dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    } else {
      //age collection ma vojod nadashte bashe khodesh dorost mikone
    //barae vared kardan .inesertOne(this) ke tamame feild haro mifrese to database
   
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
        //chizio ke peyda kardi beriz ro arry zamani khoobi ke data kheili nist
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
        // chone mangodb id sakhte vase moghayese id morede nazar bayad in modeli benevisim 
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  
    }
    static deleteById(prodId) {
      const db = getDb();
      return db
        .collection('products')
        .deleteOne({ _id: new mongodb.ObjectId(prodId) })
        .then(result => {
          console.log('Deleted');
        })
        .catch(err => {
          console.log(err);
        });
    }
}

module.exports = Product;
