// - - - - = = = = Configurations = = = = - - - - 

// express
const express = require('express');
const app = express();

// path
const path = require('path');

// body parser
const bodyParser = require('body-parser');

// middleware
app.use(express.static(__dirname + '/client/dist/product-management'));
app.use(bodyParser.json());


// - - - - = = = = Model = = = = - - - - //
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/product_manager');
mongoose.connection.on('connected', () => console.log('connected to MongoDB'));
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

//-----------------------//
//---- product schema ---//
//-----------------------//

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        minlength: [4, 'Product name must be greater than 3 characters'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required']
    },
    imageUrl: {
        type: String,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// - - - - = = = = Controller = = = = - - - - 
const productController = {
    index: (request, response) => {
  
        Product.find()
            .then(result => response.json( {message: "success", data: result} ))
            .catch(error => response.json( {message: "error", errors: error } ));
    },
    getOne: (request, response) => {

        Product.findOne({_id: request.params.id})
            .then(result => response.json( {message: "success", data: result} ))
            .catch(error => response.json( {message: "error", errors: error}));
    },
    create: (request, response) => {

        const newProduct = new Product({
            name: request.body.name,
            price: request.body.price,
            imageUrl: request.body.imageUrl
        })
        
        Product.create(newProduct)
            .then(result => response.json( {message: "success", data: result} ))
            .catch(error => response.json( {message: "error", errors: error} ));
    },
    edit: (request, response) => {

        Product.findByIdAndUpdate({_id: request.params.id}, request.body, {upsert: true, new: true, runValidators: true})
            .then(result => response.json( {message: "success", data: result} ))
            .catch(error => response.json( {message: "error", errors: error} ));
    },
    delete: (request, response) => {

        Product.deleteOne({_id: request.params.id})
            .then(result => response.json( {message: "success", data: result} ))
            .catch(error => response.json( {message: "error", errors: error} ));
    }
  };
  
  
  // - - - - = = = = Routes = = = = - - - - 
  app 
    .get('/api/products', productController.index)
    .post('/api/products', productController.create)
    .get('/api/products/:id', productController.getOne)
    .put('/api/products/:id', productController.edit)
    .delete('/api/products/:id', productController.delete)
    .all("*", (req,res,next) => {
        res.sendFile(path.resolve("./client/dist/client/index.html"))
  });

// - - - - = = = = Server Listener = = = = - - - - 
const port = 1337;
app.listen(port, ()=> console.log(`Express server listening on port ${port}`));