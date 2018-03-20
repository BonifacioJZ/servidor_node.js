'use strict'
//variables del servidor
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const Product = require('./models/product')

const port  = process.env.PORT || 3000 


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use((req, res, next)=>{
     //en vez de * se puede definir SÓLO los orígenes que permitimos
    res.header('Access-Control-Allow-Origin', '*');
    //metodos http permitidos para CORS
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();

});




//peticiones 
app.get('/api/product',(req,res)=>{
    Product.find({},(err,products)=>{
        if (err) return res.status(500).send({ message: `Error al realizar la petision :${err}` })
        if(!products) return res.status(404).send({message:"No existen productos"})
        res.status(200).send({ products })
    })
})
app.get('/api/product/:productID',(req,res)=>{

    let productId = req.params.productID
    Product.findById(productId,(err,product)=>{
        if(err) return res.status(500).send({message:`Error al realizar la petision :${err}`})
        if(!product) return res.status(404).send({message:`El producto no existe`})

        res.status(200).send( product )
       })

})
app.post('/api/product',(req,res)=>{
    console.log('POST /api/product')
    console.log(req.body)

    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description


    product.save((err,productStored)=>{
        if(err) res.status(500).send({message:`Error al salvar en la base de datos: ${err}`})


        res.status(200).send({product:productStored})
    })

})
app.put('/api/product/:productID',(req,res)=>{
    let productId = req.params.productID
    let update = req.body
    Product.findByIdAndUpdate(productId,update,(err,productUpdate)=>{
        if(err) res.status(500).send({message:`Error al actulizar el producto: ${err}`})

        res.status(200).send({product:productUpdate})
    })

})
app.delete('/api/product/:productID',(req,res)=>{
    let productId = req.params.productID
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({ message: `Error al eliminar el producto :${err}` })
        product.remove(err =>{
            if (err) return res.status(500).send({ message: `Error al eliminar el producto :${err}` })
            res.status(202).send({message:"se a eliminado el producto"})
            
        })
    })

})
//conecion a mongo db
mongoose.connect('mongodb://localhost:27017/shop2',(err,res)=>{
    if(err){
        return console.log(`hay un error de conexion ala base de datos ${err}`)
    }  
    //mensje para dar a conocer que la base de datos se a conectado exitosamente
    console.log(`conexion exitosa ala base de datos`)
    //corriendo el servidor
    app.listen(port, () => {
        console.log(`API REST corriendo en el puerto ${port}`)
    })
})
