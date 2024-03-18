'use strict'

const dbcon = require('../connection')
const { } = require('../utility/user')

const getUserPost = async function (req, res) {

   let userId = req.user.userId;
    var getPostArray = [];
    
    // const userId = req.user.userId

    // console.log("userid :: ", userId);

    await dbcon.getConnection((err, con) => {
        if (err)
            return console.error(err);
        con.query(`SELECT u2.fname , u2.u_id , u2.lname,u2.username,u2.profile ,p.*,f.status FROM (user u1, user u2, post p )
        left join friend f on 
        (f.user1_id = u1.u_id AND f.user2_id= u2.u_id) OR (f.user2_id = u1.u_id AND f.user1_id = u2.u_id)
        WHERE  u1.city_id = u2.city_id
        AND (p.u_id = u2.u_id and p.u_id != u1.u_id)  
        AND u1.u_id= ? order by p.post_date desc`, [userId], async (err, result) => {
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

                console.log("result[i].post", result[i].post );
                console.log("First Element of Post Array Result ", result[i].post); 


                
                const postId = result[i].post_id
                console.log("post_id", postId);
                let commentResult = await getCommentsToPost(postId);
                

                result[i].comments = commentResult;
                console.log('commentResult ::::: ', commentResult);

                
                // console.log("[result[i][0].post_id]",result[i][0].post_id);

                console.log("Comment Element of Post Array Result ", result[i].comments);

                let likeResult = await getLikesToPost(postId);

                result[i].likes = likeResult;
                console.log("likeResult",likeResult);

                console.log("like Element of Post Array Result ", result[i].likes);

                console.log("Element of Post Array Result ", result[i]);
                
                getPostArray.push(result[i]);
                console.log("getPostArray", getPostArray);
 
            }
            res.send(getPostArray);

            console.log("getPostArray", getPostArray);

            con.release();

        })
    })
}

module.exports = {
    getUserPost
};