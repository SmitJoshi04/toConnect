"use strict";
const dbcon = require('../connection');

const checkUserName = function (username) {
    return new Promise((resolve,reject)=>{
    dbcon.getConnection(async (err, con) => {
        if (err){
            con.release();
            return res.reject(err)
        }
        con.query('SELECT * FROM user where username =?', [username], (err, result) => {
            if (err)
                return console.log(err);
            console.log("check username result:::",result)
            con.release();
            return resolve(result);
        })
    })
})

}

// const checkUserLike = function (postId,userId) {
//     return new Promise((resolve,reject)=>{
//         dbcon.getConnection(async (err, con)=>{
//             if(err)
//             return res.reject(err)
//             con.query('SELECT like_id FROM likes WHERE post_id = ? AND u_id = ?', [postId, userId],  (err,result)=>{
//                 if(err)
//                 return console.log(err)
//                 con.release();
//                 console.log(result);
//                 return resolve(result);
//             })
//         })
//     })
    
// }

// const deleteUserLike = function (likeId) {
//     dbcon.getConnection(async(err, con)=>{
//         if(err)
//         return res.send(err)
//         con.query('DELETE FROM likes WHERE like_id =?', [likeId], (err, result)=>{
//             if(err)
//             return console.log(err)
//             con.release();
//             console.log(result)
//             console.log(" Raw Deleted Successfully")
//         })
//     })    
// }


module.exports = { checkUserName  }