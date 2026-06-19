const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model");

async function authMiddleware(req, res, next) {

    //This line is trying to get a JWT token from either cookies or headers.
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];


    if (!token) {
        return res.status(401).json({
            message: "Unathorized access, token is missing."
        })
    }


    const isBlackListed = await tokenBlackListModel.findOne({ token })


    if (isBlackListed) {
        return res.status(401).json({
            message: "Unauthorized access , toke is invalid. "
        })
    }



    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log("1. Full Decoded Token:", decoded);
      // console.log("2. Targeted ID property:", decoded.userId);

        const user = await userModel.findById(decoded.userId);

       //console.log("3. Database Result:", user);

        if(!user){
            return res.status(401).json({
                message:"Unauthorized access, user no longer exists."
            });
        }


        req.user = user;
        // Attaches the user object to the request so that the next middleware/controller can access it.

        next()


    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}



async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access , token is missing."
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({ token })

    if (isBlackListed) {
        return res.status(401).json({
            message: "Unauthorized access , toke is invalid. "
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")


        

        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access , not a system user"
            })
        }


        req.user = user

        return next()

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access , token is invalid"
        })
    }

}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}