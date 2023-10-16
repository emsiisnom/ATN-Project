const express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer');
var app = express();
var router = require('./routes.js')

const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb');

const connectionString = 'mongodb+srv://hoangvy09102003:zxcvbnm123@cluster0.zuzi4tu.mongodb.net/'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        const db = client.db('ATN')
        const productsCollection = db.collection('products')
        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(express.static('public'))
        app.use('/images', express.static('images'));

        app.use(bodyParser.json())

        app.get('/', (req, res)=>{
            res.render('admin_index')
        })

        //PRODUCT
        app.get('/product', function(req, res) {
          db.collection('products').find().toArray()
          .then(results => {

              console.log(results)

              res.render('list_product.ejs', { products: results })
          })
          .catch()          
      })

      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'images');
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
        }
      });
      
      const upload = multer({ storage: storage });

      app.post('/product/add', upload.single('proImage'), (req, res) => {
        const product = req.body;
        product.proImage = req.file.filename; 
        productsCollection.insertOne(product)
          .then(result => {
            console.log(result);
            res.redirect('/product');
          })
          .catch(error => console.error(error));
      });

      app.post('/product/add', (req, res) => {
          productsCollection.insertOne(req.body)
          .then(result => {
              
              console.log(result)

              res.redirect('/product')
           })
          .catch(error => console.error(error))
      })

      app.delete('/product/:id', (req, res) => {
        const productId  = req.params.id;
      
        productsCollection
          .deleteOne({ _id: new ObjectId(productId)  })
          .then(result => {
            if (result.deletedCount === 1) {
              res.sendStatus(200);
            } else {
              res.sendStatus(404);
            }
          })
          .catch(error => {
            console.error(error);
            res.sendStatus(500);
          });
      });

app.use('/', router);

    app.listen(3000, () =>{
        console.log(`Server started on port`);
    })
})