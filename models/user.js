const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
     
       return   new ObjectId(cp.productId).toString() == product._id.toString()
 
     });
     let newQuantity = 1;
     // copy kardim harchi to cart dashtim 
     const updatedCartItems = [...this.cart.items];

     if (cartProductIndex >= 0) {
          newQuantity = this.cart.items[cartProductIndex].quantity + 1;
          updatedCartItem[cartProductIndex ].quantity  =  newQuantity}
     else {
       // age product to cart nadashte bashim 
              updatedCartItems.push({
              productId: new ObjectId(product._id),
                quantity: newQuantity
              });}
        //update kardan cart bad az ezafeh kardan 
      const updatedCart={updatedCartItems}
    // taghirato be modele user mifresim 
    const db = getDb();
     return db
      .collection('users')
      .updateOne(
       { _id: new ObjectId(this._id) },
       { $set: { cart: updatedCart } }
      );
  }
 //merging data from user and product 
  getCart() {
    const db = getDb();
    // tamame id haye array be ma bede  string of ids 
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection('products')
      //$in  karesh in ke tamame ids ke dakhele productid az dakhele product barammon miyare
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.items.map(p => {
          return {
            //all data mikhaym plus 
            ...p,
            // bar asase id mifahmim chanta az product to cart  darim
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
