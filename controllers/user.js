"use strict";

const dbcon = require('../connection')
const bcrypt = require('bcryptjs');
const { checkUserName } = require('../utility/user');
const jwt = require('jsonwebtoken');
const e = require('express');
const secretKey = 'sculpsoftechpvtltd'


const userSignup = async function (req, res) {
    var body = req.body;
    console.log("body:::",body);
    console.log(req.file);
    let file = req.file;
    console.log("file::", file);
    if (!body && !body.fname && !body.lname && !body.username && !body.password && !body.email && !body.pnumber && !body.dob && !body.gender && !body.city)
        return res.console.error("please fill required details");

    const hashPassword = await bcrypt.hash(body.password, 10);
    console.log("hashPassword",hashPassword);
    dbcon.getConnection(async (err, con) => {
        if (err)
            return console.log(err);
        console.log("file.path",file.filename);
        con.query(`INSERT INTO user (fname, lname, username, email, password, pnumber, dob, gender, profile, city_id) VALUES ('${body.fname}', '${body.lname}', '${body.username}', '${body.email}', '${hashPassword}', ${body.phonenumber}, '${body.dob}', '${body.gender}', '${file.filename}', ${body.city})`, (err, result) => {
            // console.log(this.sql);
            if (err) {
                
                return res.send(err);
            }
            console.log("result", result);
           con.release()
            // if(body.user_type == 'V'){
            //     con.query(`INSERT INTO bussiness (u_id, b_name,b_type,role) VALUES ('${result.insertId}', '${body.lname}', '${body.username}', '${body.email}', '${hashPassword}', ${body.pnumber}, '${body.dob}', '${body.gender}', '${body.user_type}', '${file.path}', ${body.city_id})`, (err, result2) => {
            //                 if (err){
            //                     con.release()
            //                     return res.send(err);
            //                 }
            //               console.log(result2);
            //               con.query(`INSERT INTO vendor (u_id,b_id) VALUES ('${result.insertId}', '${result2.insertId}'`, (err, result3) => {
            //                         if (err){
            //                             con.release()
            //                             return res.send(err);
            //                         }
            //                         console.log(result3);
            //                         con.release();

            //                     })
            //             })
            //         }
            //     else
            //     {
            //         con.release();
            //     }
            res.status(200).json({ msg: 'user succesfully registered' })
        })
        

    });

    // const result2 = 
    //     
    //     con.release();

}
// if (body.user_type == 'V') return res.redirect('/user/vendor')
// return res.redirect('/user/login')


const userLogin = async function (req, res) {
    // console.log("req:::", req);
    let body = req.body;
    console.log("body:::", body);
    if (!body.userName && !body.password)
        return res.send("please fill required information")
    const userName = await checkUserName(body.userName);
    if (userName == false) return res.send('incorrect username')
    const passwordHash = userName[0].password

    if (!(await bcrypt.compare(body.password, passwordHash))) {
        return res.send("please enter valid password")
    }
    const user = {
        userId: userName[0].u_id,
    }
    const jwtToken = jwt.sign(user, secretKey)
    // res.send("login Successfully");
    console.log(jwtToken);

    res.status(200).json({ msg: 'user valid', jwtToken: jwtToken, userId: user.userId });
}

const home = function (req, res) {
    const Data = req.user;
    res.json({ msg: 'hello' })
    console.log(Data.decodeToken.userId);
}

const userData = function(req,res){
    let userId = req.user.userId;
    console.log(userId);
    const query = 'select u.city_id,u.fname,u.lname,u.pnumber,u.dob,u.gender,u.user_type,u.profile,c1.Cname,c2.country_name,s.state_name from user u,cities c1,countries c2,states s where u.u_id = ? && u.city_id = c1.city_id && c1.state_id = s.state_id && s.country_id = c2.country_id';
    dbcon.getConnection((err,con)=>{
        if(err){
            con.release();
        return console.log(err);
        }
        con.query(query,[userId],(err,result)=>{
            if(err){
                con.release();
            return console.log(err);
            }
            console.log("user data in edit:::",result);
            res.json(result);
        })
    })
}



module.exports = { userSignup, userLogin, home,userData };

