'use strict';
const dbcon = require('../connection');
const { use } = require('../routes/friend');

const sendFriendReq = async function(req,res){

    var body= req.body;
    if(!body.u_id) return console.error("cannot find user id in body");
    const user1Id = req.user.userId;

    await dbcon.getConnection((err,con)=>{
        if(err)
        return console.error(err);
        con.query(`INSERT INTO friend (user1_id, user2_id) VALUES (${user1Id},${body.u_id})`,(err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();
        })
    })
}

const acceptFriendreq = async function(req,res){
    var body= req.body;
    const user2Id = req.user.userId;

console.log("userId :::", user2Id )
console.log("body :::", body);
    await dbcon.getConnection((err,con)=>{
        if(err)
        return console.error(err);
        con.query(`UPDATE friend SET status = ? WHERE user1_id =? AND user2_id =? `, ['A', body.user1_id, user2Id], (err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            console.log("result",result);
            res.send(result)
            con.release();
        } )
    })
}

const rejectFriendReq = async function (req, res) {
    var body= req.body;
    const user2Id = req.user.userId
    console.log("userId :::", user2Id )
console.log("body :::", body);

    await dbcon.getConnection((err,con)=>{
        if(err)
        return console.error(err);
        con.query(`DELETE FROM friend WHERE user1_id =? AND user2_id =? `, [ body.user1_id, user2Id], (err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();
        } )
    })
}
 
const getFriendReq = async function (req, res) {
    const user2Id = req.user.userId;
    console.log("user2 id :: ", user2Id );

    await dbcon.getConnection((err,con)=>{
        if(err)
        console.error(err);
        con.query(`SELECT user.username , user.profile, user.u_id, friend.friendreq_time FROM user JOIN friend ON friend.user1_id = user.u_id  WHERE friend.user2_id =? AND friend.status =?` , [user2Id, 'P'], (err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            con.release();
            console.log(result);
            console.log("friend req is getting Successfully");
            return res.send(result)
        })
    })
    
}
module.exports={sendFriendReq, acceptFriendreq, rejectFriendReq, getFriendReq}