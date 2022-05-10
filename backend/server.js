import express from 'express'
import data from './data.js'
import cors from 'cors'

const app = express()

app.use(cors())



app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/products', function (req, res) {
  res.send(data)
})

app.get('/products/:slug', function (req, res) {
  let product = data.find((item)=>{
    if(req.params.slug == item.slug){
      return item
    }
  })
  res.send(product)
})

app.get('/cartproduct/:id', function (req, res) {

  let product = data.find((item)=>{
    if(req.params.id == item._id){
      return item
    }
  })
  res.send(product)
})


app.listen(8000,()=>{
  console.log("server running on 8000 port");
})