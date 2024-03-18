'use strict'

const dbcon = require("../connection");

const getUsersProfileData = async function (req,res){
    let user = req.body;
    console.log("user",user);
    const query = `select * from user where u_id= ${user.userId}`
    await dbcon.getConnection((err, con) => {
        if (err) {
            return res.send(err);
        }
        con.query(query, (err, result) => {
            if (err) {
                con.release()
                return res.send(err);
            }
            res.send(result);
            con.release();
            console.log("resultof user data::", result);
            // response = result;
            // console.log("response of user data:::", response);
        })

})
}

const getUsersPost = async function (req, res) {

    var getPostArray = [];
    let user = req.body;
    // let response = [];
    console.log("req.user ::: ", user);
   

        // const userId = req.user.userId

        // console.log("userid :: ", userId);

        await dbcon.getConnection((err, con) => {
        con.query(`SELECT * FROM post WHERE u_id =?`, [user.userId], async (err, result) => {
            if (err)
                console.error(err);
            // res.send(result);
            console.log((result));



            async function getCommentsToPost(post_id) {
                return new Promise((resolve, reject) => {
                    console.log("::::::::::::::::::::", post_id);
                    con.query(`SELECT * FROM comments WHERE post_id=?`, [post_id], (err2, resultComment) => {
                        console.log("::::::::::::::::::::");
                        if (err2)
                            return reject(err2);
                        console.log('resultComment', resultComment);
                        resolve(resultComment)

                    })
                })
            }


            async function getLikesToPost(post_id) {
                return new Promise((resolve, reject) => {
                    console.log("::::::::::::::::::::", post_id);

                    con.query(`SELECT * FROM likes WHERE post_id=?`, [post_id], (err3, resultlike) => {
                        console.log("::::::::::::::::::::");
                        if (err3)
                            return reject(err3);
                        console.log('resultlike', resultlike);
                        resolve(resultlike)

                    })
                })
            }

            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                

                // result[i].post = result[i];

                console.log("result[i].post", result[i].post);
                console.log("First Element of Post Array Result ", result[i].post);



                const postId = result[i].post_id
                console.log("post_id", postId);
                commentResult = await getCommentsToPost(postId);


                result[i].comments = commentResult;
                console.log('commentResult ::::: ', commentResult);


                // console.log("[result[i][0].post_id]",result[i][0].post_id);

                console.log("Comment Element of Post Array Result ", result[i].comments);

                likeResult = await getLikesToPost(postId);

                result[i].likes = likeResult;
                console.log("likeResult", likeResult);

                console.log("like Element of Post Array Result ", result[i].likes);

                console.log("Element of Post Array Result ", result[i]);

                getPostArray.push(result[i]);
                console.log("getPostArray", getPostArray);

            }
            // res.send(getPostArray);
            console.log("getPostArray", getPostArray);
            res.send(getPostArray);
            // response.push(getPostArray);
            // console.log("whole response:::", response);
            con.release();
            // res.json(response);
        })
    })
}



const getUsersFriend = async function (req, res) {
    let user = req.body;
    console.log("body", body);
    ;
    await dbcon.getConnection((err, con) => {
        if (err) {
            con.release()
            return res.send(err);
        }
        con.query(`SELECT u.fname,u.lname,u.username,u.email,u.profile,u.u_id FROM friend f,user u WHERE ((f.user2_id =? OR f.user1_id=?) AND status =? AND (u.u_id = f.user1_id or u.u_id = f.user2_id)) AND u.u_id!= ?;`, [user.userId,user.userId, 'A',user.userId], async (err, result) => {
            if (err) {
                console.error(err);
                con.release();
            }
            console.log("result of no. of friends::", result);
            res.send(result);
            // response.push(result);
            // console.log("response of friend and user data:::", response);

        })
    })
}



module.exports = { getUsersPost, getUsersFriend, getUsersProfileData};     