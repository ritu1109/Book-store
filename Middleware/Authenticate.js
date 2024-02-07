
import JWT from 'jsonwebtoken';
import reply from "../Helpers/Reply.js"
import Token from "../Models/Token.js";
import User from "../Models/User.js";
import dotenv from "dotenv";
dotenv.config();



const PUBLIC_KEY =  process.env.JWT_KEY;

export default {
    
       
    userAuthenticate: async (req, res, next) => {

        // Is Token
        var token = req.header('Authorization')?.split(' ')[1];
        
        if (token == null) return unAuthError(res); 

        // Verify Token 
        const result = JWT.verify(token, PUBLIC_KEY, function (err, user) { 
            if (err)return 0; 

            return user;
        });
    
        if (result == 0)  return unAuthError(res);
 
        // Check Token In Database After Verify
        let is_token = await Token.findOne({where:{jti: result.jti}});
        
        if (is_token == null)  return unAuthError(res); 
        let user = await User.findByPk(is_token.user_id);

        if (user == null) return unAuthError(res);
         
        req.user = user;
        next();
    },
    

    authorAuthenticate: async (req, res, next) => {

    // Is Token
    var token = req.header('Authorization')?.split(' ')[1];
    
    if (token == null) return unAuthError(res); 

    // Verify Token 
    const result = JWT.verify(token, PUBLIC_KEY, function (err, user) { 
        if (err)return 0; 

        return user;
    });

    if (result == 0)  return unAuthError(res);

    // Check Token In Database After Verify
    let is_token = await Token.findOne({where:{jti: result.jti}});
    
    if (is_token == null)  return unAuthError(res); 
    let user = await User.findByPk(is_token.user_id);

    if (user == null || user.role!='author') return unAuthError(res);
     
    req.user = user;
    next();
}
}

function unAuthError(res){
    return res.status(401).json(reply.unauth());
}

