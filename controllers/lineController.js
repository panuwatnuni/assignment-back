const utl = require("../utl.js")
const db = require("../db.js")
const memoize = require("memoizee");
async function sendLine(req, res) {
    let reply_token = req.body.events[0].replyToken,
        message = req.body.events[0].message.text,
        userId = req.body.events[0].source.userId
    let  subMsg = message.split(' ')
        console.log(`subMsg.length = ${subMsg.length}`)
        console.log(`message = ${message}`)
        console.log(req.body.events[0])
        if (subMsg.length == 2) {
            let event = subMsg[0],
            name = subMsg[1]
            if (event == 'add') {
                let checkDup = await new Promise((resolve, reject) => {
                    db.db.collection('user').where('userId', '==', userId).get().then((snapshot)=> {
                        let result = []
                        snapshot.forEach(doc=> {
                            result.push(doc.data())
                        })
                        resolve(result)
                    })
                })
                if (checkDup.length > 0) {
                    msgRes = 'Line นี้ได้ทำการลงทะเบียนแล้ว'
                } else {
                    let obj = {
                        name: name,
                        user: `scg_${name}`,
                        userId: userId
                    }
                    db.setData('user',obj)
                    msgRes = 'ลงทะเบียนสำเร็จคะ'
                }
                replyMsg = {
                    type: 'text',
                    text: msgRes
                }
                utl.reply(reply_token, replyMsg)
            } else if (event == 'update') {
                updateDB(userId, name)
                replyMsg = {
                    type: 'text',
                    text: 'แก้ไขชื่อเรียบร้อย'
                }
                utl.reply(reply_token, replyMsg)
            }
        } else if (subMsg.length == 1) {
            if (message == 'ดูข้อมูล') {
                let getData = await new Promise((resolve, reject) => {
                    db.db.collection('user').where('userId', '==', userId).get().then((snapshot)=> {
                        let result = []
                            snapshot.forEach(doc=> {
                                result.push(doc.data())
                            })
                            resolve(result[0])
                    })
                })
                let txtShow = `ชื่อ: ${getData.name} \nUser: ${getData.user} \n UserID: ${getData.userId}
                `
                replyMsg = {
                    type: 'text',
                    text: txtShow
                }
                utl.reply(reply_token, replyMsg)
            }
        }
        res.sendStatus(200)
}
async function getDB(req, res) {
    let name = 'xxxx'
    let checkDup = await new Promise((resolve, reject) => {
        db.db.collection('user').get().then((snapshot)=> {
            let result = []
            snapshot.forEach(doc=> {
                console.log(doc.id, " => ", doc.data());
                result.push(doc.data())
            })
            resolve(result)
        })
    })
    res.send(checkDup)
}
async function setDB(req, res) {
    let obj = {
        name: 'Bundan2',
        user: 'Bundan223'
    }
    db.setData('user',obj)
    res.send('insertOK')
}
async function updateDB(lineID,name) {
    let getID = await new Promise((resolve, reject) => {
        db.db.collection('user').where('userId', '==', lineID).get().then((snapshot)=>{
            let result = ''
            snapshot.forEach(doc=> {
                result = doc.id
            })
            resolve(result)
        })
    })
    db.db.collection('user').doc(getID).update({
        'name': name,
    })
    .then(function() {
        console.log("Document successfully updated!");
    });
    res.send({id: getID})
    console.log(getID)
}
exports.getDB = getDB
exports.sendLine = sendLine
exports.setDB = setDB