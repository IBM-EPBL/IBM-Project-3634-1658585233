require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

//APP config
const app = express()
app.use(express.json())
app.use(express.urlencoded()) 
app.use(cors())

//DB config

mongoose.connect('mongodb://127.0.0.1:27017/IBM-Prototype_DB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => console.log("DB connected"))
const reminderSchema = new mongoose.Schema({
    reminderMsg: String,
    remindAt: String,
    isReminded: Boolean
}) 
const Reminder = new mongoose.model("reminder", reminderSchema)

//Whatsapp reminding functionality

setInterval(() => {
    Reminder.find({}, (err, reminderList) => {
        if(err) {
            console.log(err)
        }
        if(reminderList){
            reminderList.forEach(reminder => {
                if(!reminder.isReminded){
                    const now = new Date()
                    if((new Date(reminder.remindAt) - now) < 0) {
                        Reminder.findByIdAndUpdate(reminder._id, {isReminded: true}, (err, remindObj)=>{
                            if(err){
                                console.log(err)
                            }
                            const client = require('twilio')('ACed0ea1d4fae9d7375672d0742331e96b','dcc8fb9228ae68d156727d7ed5f656b2'); 
 
                                client.messages 
                                        .create({ 
                                                body: reminder.reminderMsg,         
                                                to: '+919952268641',
                                                from:'+12182978628',
                                            }) 
                                            .then(message => console.log(message.sid)) 
                                            .done();
                        })
                    }
                }
            })
        }
    })
},1000)
;

//API routes
app.get("/getAllReminder", (req, res) => {
    Reminder.find({}, (err, reminderList) => {
        if(err){
            console.log(err)
        }
        if(reminderList){
            res.send(reminderList)
        }
    })
})

app.post("/addReminder", (req, res) => {
    const { reminderMsg, remindAt } = req.body
    const reminder = new Reminder({
        reminderMsg,
        remindAt,
        isReminded: false
    })
    reminder.save(err => {
        if(err){
            console.log(err)
        }
        Reminder.find({}, (err, reminderList) => {
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    })

})

app.post("/deleteReminder", (req, res) => {
    Reminder.deleteOne({_id: req.body.id}, () => {
        Reminder.find({}, (err, reminderList) => {
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    })
})

app.listen(9000, () => console.log("Be started"))

