const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

MongoClient.connect('mongodb+srv://user:password@cluster0.o3vmh.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

        app.listen(3000, function(){
            console.log('listening on 3000')
        })
        
        // app.get('/', (req, res) => {
        //     res.sendFile(__dirname + "/index.html")
        // })

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
              .then(results => {
                res.render('index.ejs', { quotes: results })
              })
            .catch(error => console.error(error))
          })

        app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
            console.log(result)
            res.redirect('/')
            })
            .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                  $set: {
                    name: req.body.name,
                    quote: req.body.quote
                  }
                },
                {
                  upsert: true
                }
              )
              .then(result => {
                res.json('Success')
                console.log(result)

               })
                .catch(error => console.error(error))
          })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
              { name: req.body.name }
            )
              .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vadar's quote`)
              })
              .catch(error => console.error(error))
          })

  
    })
    .catch(error => console.error(error))

    




// app.listen(3000, function(){
//     console.log('listening on 3000')
// })

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html")
// })

// app.post('/quotes', (req, res) => {
//     console.log(req.body)
// })

console.log("May Node be with you")
console.log(__dirname)