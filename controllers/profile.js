const dbcon = require("../connection");

// const getPosts = (req,res)=>{
//     let user = req.user;
//     console.log(user);
//     const query = `select * from post where u_id= ${user.userId} order by post_id desc;`
//     dbcon.getConnection((err,con)=>{
//         if (err){
//             con.release()
//             return res.send(err);
//         }
//         con.query(query,(err,result)=>{
//             if (err){
//                 con.release()
//                 return res.send(err);
//             }
//             res.json(result);
//         })
//     })
// }
const getUserPost = async function (req, res) {

    var getPostArray = [];
    let user = req.user;
    let response=[];
    console.log("req.user ::: ",user);
    const query = `select * from user where u_id= ${user.userId}`
    await dbcon.getConnection((err,con)=>{
        if (err){
            con.release()
            return res.send(err);
        }
        con.query(query,(err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            console.log("resultof user data::",result);
            response.push(result);
            console.log("response of user data:::",response);
        })
    
    
    // const userId = req.user.userId

    // console.log("userid :: ", userId);

    
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
                            return reject(err2);
                        console.log('resultlike', resultlike);
                        resolve(resultlike)

                    })
                })
            }

            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                commentLike = [];
                commentResult = [];

                // result[i].post = result[i];

                console.log("result[i].post", result[i].post );
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
                console.log("likeResult",likeResult);

                console.log("like Element of Post Array Result ", result[i].likes);

                console.log("Element of Post Array Result ", result[i]);
                
                getPostArray.push(result[i]);
                console.log("getPostArray", getPostArray);

            }
            // res.send(getPostArray);
            console.log("getPostArray", getPostArray);
            response.push(getPostArray);
            console.log("whole response:::",response);
            con.release();
            res.json(response);
        })
    })
}


module.exports = {getUserPost};