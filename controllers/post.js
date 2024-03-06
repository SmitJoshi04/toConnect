const dbcon = require('../connection')
const { } = require('../utility/user')

const userPost = async function (req, res) {
    console.log("user post function sudhi pahoche chhe");
    var body = req.body;
    const userId = req.user.userId
    let file = req.file;
    console.log("file:::",file);
    await dbcon.getConnection((err, con) => {
        if (err)
            return res.send(err)
        con.query(`INSERT INTO post (u_id, post_text,photo_path) VALUES (${userId} , '${body.post_text}', '${file.filename}')`, (err, result) => {
            if (err){
                con.release()
                return res.send(err);
            }
            console.log("result:::",result);
            res.send(result)
            con.release();
        })

    })
}

const getUserPost = async function (req, res) {

    var body = req.body;
    var getPostArray = [];
    
    // const userId = req.user.userId

    // console.log("userid :: ", userId);

    await dbcon.getConnection((err, con) => {
        if (err)
            return console.error(err);
        con.query(`SELECT * FROM post WHERE u_id =?`, [body.u_id], async (err, result) => {
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
            res.send(getPostArray);

            console.log("getPostArray", getPostArray);

            con.release();

        })
    })
}


const deletePost = async function (req, res) {

    var body=req.body
    const userId = req.user.userId

    await dbcon.getConnection((err, con) => {
        if (err)
            return res.send(err)
        con.query(`DELETE FROM post WHERE post_id=? AND u_id=?`, [body.post_id, userId], (err, result) => {
            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();
        })

    })

}
const userComment = async function (req, res) {
    var body = req.body
    const userId = req.user.userId;
    if (!body.comment_text) return res.send("please enter text")

    await dbcon.getConnection((err, con) => {
        if (err)
            return res.send(err)
        con.query(`INSERT INTO comments (post_id, u_id, comment_text) VALUES (${body.post_id} , ${userId} , '${body.comment_text}') `, (err, result) => {

            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();

        })
    })
}

const deleteComments = async function (req, res) {
    var body = req.body
    const userId = req.user.userId;

    await dbcon.getConnection((err, con) => {
        if (err)
            return res.send(err)
        console.log("body :: ", body);
        console.log("userId :: ", userId);
        con.query(`DELETE FROM comments WHERE comment_id=? AND u_id=?`, [body.comment_id, userId], (err, result) => {
            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();
            console.log("Comment deleted Successfully");
        })

    })
}



const updateComments = async function (req, res) {
    var body = req.body
    const userId = req.user.userId;

    dbcon.getConnection((err, con) => {
        if (err)
            return console.error(err);
        con.query(`UPDATE comments SET comment_text =? WHERE comment_id =? AND u_id =?`, [body.comment_text, body.comment_id, userId], (err, result) => {
            if (err){
                con.release()
                return res.send(err);
            }
            res.send(result)
            con.release();
            console.log("Comment updated Successfully");
        })
    })
}
const userLike = async function (req, res) {
    var body = req.body
    const userId = req.user.userId;

    // const userLike = await checkUserLike(body.post_id, userId)
    //  const sameUserLike = userLike[0].like_id
    // console.log(sameUserLike);
    // if (sameUserLike !== null) {
    //     deleteUserLike(sameUserLike);
    //     return;
    // }

    dbcon.getConnection((err, con) => {
        if (err)
            return res.send(err)
        con.query('SELECT like_id FROM likes WHERE post_id = ? AND u_id = ?', [body.post_id, userId], (err, result) => {
            if (err){
                con.release()
                return res.send(err);
            }
            // res.send(result)


            if (result.length !== 0) {
                const sameUserLike = result[0].like_id
                con.query('DELETE FROM likes WHERE like_id =?', [sameUserLike], (err, result) => {
                    if (err){
                        con.release()
                        return res.send(err);
                    }
                    console.log(result)
                    console.log(" Raw Deleted Successfully")
                })
            }
            else {
                con.query(`INSERT INTO likes (post_id , u_id)  VALUES (${body.post_id}, ${userId})`, (err, result) => {
                    if (err){
                        con.release()
                        return res.send(err);
                    }
                    console.log(result);
                    console.log(" Raw created Successfully")
                    return res.send(result);
                })
            }
        })
        con.release();
    })

}


module.exports = { userPost, userComment, userLike, deletePost, deleteComments, updateComments, getUserPost };