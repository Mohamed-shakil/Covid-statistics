const express = require('express')
const mongoose=require('mongoose')
const app = express()
const bodyParser = require("body-parser");
const port = 8081;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.use('/totalRecovered',async (req,resp)=>{
    const recovereddata= await connection.find();
    let recovered=0;
    recovereddata.forEach(element => {
        recovered+=element.recovered;
    });
    resp.send({data: {_id: "total", recovered:`${recovered}`}});
})

app.use('/totalActive',async (req,resp)=>{
    const alldata= await connection.find();
    let recovered=0;
    let infected=0;
    alldata.forEach(element => {
        recovered+=element.recovered;
        infected+=element.infected;
    });
    const active=infected-recovered;
    resp.send({data: {_id: "total", active:`${active}`}});
})

app.use('/totalDeath',async (req,resp)=>{
    const alldata= await connection.find();
    let death=0;
    alldata.forEach(element => {
        death+=element.death;
    });
    resp.send({data: {_id: "total", death:`${death}`}});
})

app.use('/hotspotStates',async (req,resp)=>{
    const alldata= await connection.find();
    let statearr=[];
    let recovered=0;
    let infected=0;
    alldata.forEach(element => {
        recovered+=element.recovered;
        infected+=element.infected;
        const rate=(infected-recovered)/infected;
        const roundedrate=(Math.round((rate*100000)))/100000;
        if(rate>0.1)
        {
            statearr.push({state: element.state, rate: rate});
        }
    });
    resp.send({data: `${statearr}`});
})

app.use('/healthyStates',async(req,resp)=>{
    const alldata= await connection.find();
    let healthystatearr=[];
    let death=0;
    let infected=0;
    alldata.forEach(element => {
        death+=element.death;
        infected+=element.infected;
        const healthy=death/infected;
        const mortality=(Math.round((healthy*100000)))/100000;
        if(mortality<0.005)
        {
            healthystatearr.push({"state": element.state, "mortality": mortality});
        }
    });
    resp.send({data: healthystatearr});
})




module.exports = app;