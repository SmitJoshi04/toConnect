const dbcon = require("../connection");

const getPosts = (req,res)=>{
    let user = req.user;
    console.log(user);
    const query = `select p1.*,p2.photo_id,p2.photo_path from post p1 join photo p2 on(p1.post_id = p2.post_id) where p1.u_id= ${user.userId} order by p1.post_id desc;`
    dbcon.getConnection((err,con)=>{
        if (err){
            con.release()
            return res.send(err);
        }
        con.query(query,(err,result)=>{
            if (err){
                con.release()
                return res.send(err);
            }
            res.json(result);
        })
    })

}


module.exports = {getPosts};