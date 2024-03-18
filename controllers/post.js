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


module.exports = { userPost, userComment, userLike, deletePost, deleteComments, updateComments };