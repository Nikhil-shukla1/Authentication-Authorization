const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    token:{// we will not save that jwt token 
        type:String,
        default:null
    }
},{
    timestamps: true,
}
)
module.exports = mongoose.model("User",userModel);