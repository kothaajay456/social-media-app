const mongoose=require("mongoose");
const validator=require("validator");
const bycrpt=require("bcryptjs");
const Post =require("./PostModel");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please Provide username"],
        unique:true,
        trim:true,
        minlength:3,
        maxlength:10,
        index:true,
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please provide a valid email"],
    },
    password:{
        type:String,
        required:[true,"Please provide Password"],
        minlength:8,
        select:false,
    },
    passwordConfirm:{
         type:String,
        required:[true,"Please confirm Password"],
        minlength:8,
        select:false,
        validate:{
            validator: function (el) {
                return el===this.password;
            },
            message:"Passwords are not same",
        },
    },
    profilePicture:{
        type:String,
    },
    bio:{
        type:String,
        maxlength:150,
        default:"",
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

     following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

     posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    }],
    savePosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    }],
    isverified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpires:{
        type:Date,
        default:null,
    },
    resetPasswordOtp:{
        type:String,
        default:null
,
    },
     resetPasswordOtpExpires:{
        type:Date,
        default:null

    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    role: 
    {
     type: String,
     enum: ['user', 'admin'],
     default: 'user',
   },
},{
    timestamps:true,
}
);




userSchema.pre("save",async function(next)
{
    if(!this.isModified("password"))
    {
    return next();
    }
    this.password=await bycrpt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
})



userSchema.methods.correctPassword = async function(candidatePassword) {
  if (!this.password) return false; 
  return await bycrpt.compare(candidatePassword, this.password);
};


const User=mongoose.model("User",userSchema);

module.exports=User;
