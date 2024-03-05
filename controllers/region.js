const dbcon = require("../connection");


const getCountries = async (req,res)=>{
    const  query = `select * from countries`;
    const con = await dbcon.getConnection((err,con)=>{
        if (err) {
            return res.send(err);
        }
        con.query(query,(err,result)=>{
            if (err) {
                con.release()
                return res.send(err);
            }
            console.log(result);
        con.release();
        return res.send(result)
        });
    });
}

const getStates = async (req,res)=>{
    console.log(req.body);
    const countryId = req.body.countryId;

    console.log("countryId:::",countryId);
    const  query = `select * from states where country_id = ?`;
    dbcon.getConnection((err,con)=>{
        if (err) {
            return res.send(err);
        }
        con.query(query,[countryId],(err,result)=>{
            if (err) {
                con.release()
                return res.send(err);
            }
            console.log(result);
        con.release();
        return res.send(result)
        });
    });
}

const getCities = async (req,res)=>{
    
    const stateId = req.body.stateId;
    const  query = `select * from cities where state_id = ?`;
    const con = await dbcon.getConnection((err,con)=>{
        if (err) {
            return res.send(err);
        }
        con.query(query,[stateId],(err,result)=>{
            if (err) {
                con.release()
                return res.send(err);
            }
            console.log(result);
        con.release();
        return res.send(result)
        });
    });
}

module.exports = {getCities,getCountries,getStates}