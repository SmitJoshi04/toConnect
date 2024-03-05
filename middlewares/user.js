const jwt  = require("jsonwebtoken");
const secretKey = 'sculpsoftechpvtltd'

function verifyToken(req,res,next){
    const header = req.header('authorization');
    if(!header) return res.send("invalid token")
    const decodeToken = jwt.verify(header, secretKey)
    // payload = {decodeToken}
    console.log("decode token:::",decodeToken);
    req.user = decodeToken ;
    next( );
}

module.exports={verifyToken}