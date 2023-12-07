require('dotenv').config() //When you install first column dependies
require('./db') //When configure your connection with database

const express = require('express')
const app = express();

const cors = require('cors') //When your app's api connect with the forntend applications
app.use(cors())

//When use your app any json object or form fill up
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Setup our routes dependence of versions
if(process.env.VERSIONS = 'v1'){
    console.log('v1')
    
    const routers = require('./src/api/v1/routers') //Connect your routes here

    app.use('/api/v1/users',routers) //Can define path or respose of your apis path
}

const Server = process.env.SERVER || 'http://localhost';
const Port = process.env.PORT || 8000 ;

app.listen(Port,()=> console.info(`Application listen at ${Server}:${Port}`))