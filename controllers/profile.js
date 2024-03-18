const dbcon = require("../connection");

const getUserProfileData = async function (req,res){
    let user = req.user;
    console.log("user",user);
    const query = `select * from user where u_id= ${user.userId}`
    await dbcon.getConnection((err, con) => {
        if (err) {
            con.release();
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

const getUserPost = async function (req, res) {

    var getPostArray = [];
    let user = req.user;
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



const getUserFriend = async function (req, res) {
    let user = req.user;
    await dbcon.getConnection((err, con) => {
        if (err) {
            con.release()
            return res.send(err);
        }
        con.query(`SELECT user1_id FROM friend WHERE user2_id =? AND status =?`, [user.userId, 'A'], async (err, result) => {
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

const editProfilePicture = async function(req,res){

let user= req.user;
console.log("user:::",user);
let file = req.file;
console.log("file:::",file);

const query = `UPDATE user SET profile =? WHERE u_id =?`
await dbcon.getConnection((err, con) => {
    if (err) {
        con.release()
        return res.send(err);
    }
    con.query(query,[file.filename, user.userId], (err, result) => {
        if (err) {
            con.release()
            return res.send(err);
        }
        res.send(result);
        con.release();
        console.log("result of updated profile data::", result);
        // response = result;
        // console.log("response of user data:::", response);
    })

}) 


}


module.exports = { getUserPost, getUserFriend, getUserProfileData,editProfilePicture };     