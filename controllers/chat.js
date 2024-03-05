'use strict'
const { response } = require('express');
// const PORT= 8001;

const dbcon = require('../connection')

const getConversation = async function(req,res){

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    console.log("test");
    
    const user = req.user;

    await dbcon.getConnection(async(err,con)=>{
        if (err){
            con.release()
            return res.send(err);
        }
        const query = `SELECT 
        desired_table.u_id,desired_table.user1_id,desired_table.user2_id,desired_table.chat_id,fname,lname,desired_table.text,desired_table.text_id,profile FROM user 
        JOIN
            (SELECT * FROM 
               (SELECT 
                 u.u_id,c.user1_id,c.user2_id,c.chat_id,
                (SELECT t.text FROM text t WHERE t.chat_id = c.chat_id ORDER BY t.text_id DESC LIMIT 1) text,
                (SELECT t.text_id FROM text t WHERE t.chat_id = c.chat_id ORDER BY t.text_id DESC LIMIT 1) text_id,
                ((SELECT u1.u_id FROM user u1 WHERE (u1.u_id = c.user1_id and not (u1.u_id = u.u_id))) UNION
                   (SELECT u2.u_id FROM user u2 WHERE (u2.u_id = c.user2_id  and not (u2.u_id = u.u_id))))userID
            
            FROM user u, chat c WHERE (c.user1_id = u.u_id OR c.user2_id = u.u_id) AND u.u_id = ?) as t1 
            )as desired_table 
        ON user.u_id=desired_table.userID ORDER BY desired_table.text_id desc;`
        await con.query(query,[user.userId],(err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            con.release()
            let response = {
                result:result,
                uId:user.userId
            }
            return res.json(response);
        })
    })
}

const getConversationText = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    
    //getting data from database(text messages)
    
    const user = req.user;
    const body = req.body;
    let receiverId;
    console.log("body:::",body);
    if(body.user1Id == user.userId )
    {
        receiverId = body.user2Id;
    }
    else
    receiverId = body.user1Id;
    console.log("receiverId:::",receiverId);
    const chatId = req.body.chatId;
    console.log("user:::",user);
    console.log("chatId:::",chatId);
    // console.log("params:::",params);
    const query = `SELECT t.* FROM text t where (t.sen_id = ? or t.rec_id = ?) and chat_id = ? group by t.text_id;`
    await dbcon.getConnection(async (err,con)=>{
        if(err)
        return res.send(err)
        await con.query(query,[user.userId,user.userId,chatId],(err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            console.log(result);
            let response = {
                text : result,
                body : {
                    uId:user.userId,
                    fname:body.fname,
                    lname:body.lname,
                    profilePhoto:body.profile,
                    receiverId:receiverId
                }
            }
            res.send(response);
            con.release();
            return
        })
    })
    

}

module.exports = {getConversation,getConversationText}