const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyC3rJFZeDi7cHalUYFmppYt3GtT-yTx1jg",
    authDomain: "linebotstore.firebaseapp.com",
    databaseURL: "https://linebotstore.firebaseio.com",
    projectId: "linebotstore",
    storageBucket: "linebotstore.appspot.com",
    messagingSenderId: "1084808564492",
    appId: "1:1084808564492:web:e23df6e1b40c32a6"
};
const fire = firebase.initializeApp(firebaseConfig);
const db = fire.firestore()

function getData(tbl,condition) {
    return new Promise((resolve, reject) => {
        db.collection(tbl).where(condition).get().then((snapshot)=> {
            let result = []
            snapshot.forEach(doc=> {
                result.push(doc.data())
            })
            resolve(result)
        })
    })
}
function setData(tbl, data) {
    db.collection(tbl).add(data)
}
exports.db = db
exports.getData = getData
exports.setData = setData
