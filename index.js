const Joi=require('joi')
const async=require('async');
const express = require('express');
const app = express();
app.use(express.json())
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));;
const names=[
    {id:1, name:'sathish'},
    {id:2, name:'sai'},
    {id:3, name:'chandra'}, 
]
async.auto({
    getbyany: function(callback){
    app.get('/', (req,res)=> {
        res.send('hello world')
    })
    callback(null)
},
     getbyname : function(callback){
     app.get('/api/names',(req,res)=> {
    res.send(names)
})
callback(null)
},
     post : function(callback){
   app.post('/api/names',(req,res)=>{
    const {error}=validatename(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const name={
        id:names.length+1,
        name:req.body.name
    }
names.push(name)
res.send(name)
})
callback(null,"my")
},
getbyid : function(callback){
app.get('/api/names/:id',(req,res)=>{
    const name=names.find(n => n.id=== parseInt(req.params.id))
    if(!name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    res.send(name)
})
callback(null,"name")
},
put : function(callback){
app.put('/api/names/:id',(req,res)=>{
    const Name=names.find(n => n.id === parseInt(req.params.id))
    if(!Name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    const {error}=validatename(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    Name.name=req.params.name
    res.send(Name)
})
callback(null,"is")
},
delete : function(callback){
app.delete('/api/names/:id',(req,res)=>{
    const name=names.find(n => n.id === parseInt(req.params.id))
    if(!name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    const index=names.indexOf(name)
    names.splice(index,1)
    res.send(name)
})
callback(null,"sathish sai chandra")
}
}, function(err, results) {
    if(err){
        console.log("error occured");
    }
    if(!err){
        app.get('/api/results',(req,res)=>{
            res.send(results);
        })
    }}
)
function validatename(name){
    const schema={
        name: Joi.string().min(2).required()
    }
    return Joi.validate(name,schema)
}
const port=process.env.PORT ||4000
app.listen(port,()=>console.log(`server started at ${port}`));
