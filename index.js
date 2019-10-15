const Joi=require('joi')
const waterfall = require('async-waterfall');
const express = require('express');
const app = express();
app.use(express.json())
const names=[
    {id:1, name:'sathish'},
    {id:2, name:'sai'},
    {id:3, name:'chandra'}, 
]
app.get('/', (req,res)=> {
    res.send('hello world')
})
app.get('/api/names',(req,res)=> {
    res.send(names)
})
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
app.get('/api/names/:id',(req,res)=>{
    const name=names.find(n => n.id=== parseInt(req.params.id))
    if(!name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    res.send(name)
})
app.put('/api/names/:id',(req,res)=>{
    const name=names.find(n => n.id=== parseInt(req.params.id))
    if(!name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    const {error}=validatename(req.body)
    if(error) return res.status(400).send(error.details[0].message)
})
app.delete('/api/names/:id',(req,res)=>{
    const name=names.find(n => n.id=== parseInt(req.params.id))
    if(!name) return res.status(404).send('The Name With The Given ID Was Not Found.')
    const index=names.indexOf(name)
    names.splice(index,1)
    res.send(name)
})
function validatename(name){
    const schema={
        name: Joi.string().min(2).required()
    }
    return Joi.validate(name,schema)
}
const nam={"first":[{"id":1,"name":"sathish"}],
           "middle":[{"id":2,"name":"sai"}],
           "last":[{"id":3,"name":"chandra"}]};
app.get('/api/all',(req,res)=>{
    var result=[];
    waterfall([
        function task1(callback) {
            callback(null,nam.first); 
        },
        function task2(a,callback) {
            callback(null,nam.middle); 
            result.push(a);
        },
        function task3(b,callback) {
            result.push(b);
            callback(null,nam.last);  
        }
    ],function (err,final){
            result.push(final);
            res.send(result);
        })
    })
const port=process.env.PORT ||3000
app.listen(port,()=> console.log(`listening on port${port}...`))