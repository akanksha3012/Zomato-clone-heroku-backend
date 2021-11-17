import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String},
    address: [{
                details: {type: String},
                for:{type: String},
             }],
    phoneNumber:[{type:Number}],
    },{
        timestamps: true
});

//statics and methods

UserSchema.methods.generateJwtToken =  function() {
    return Jwt.sign({user: this._id.toString() }, "ZomatoAPP");
};

UserSchema.statics.findByEmailAndPassword = async ({password, email}) => {
    //check weather email exists
    const user = await UserModel.findOne({email});
    if(!user) throw new Error("User does not exists!");

    //compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if(!doesPasswordMatch) throw new Error("Invalid password!!");

    return user;
};

UserSchema.statics.findByEmailAndPhone = async({email, phoneNumber}) => {
    //check weather email exists
    const checkUserByEmail = await UserModel.findOne({email});
        const checkUserByPhone = await UserModel.findOne({phoneNumber});

        if(checkUserByEmail || checkUserByPhone){
            throw new Error("user already exists..!");
        }
        return false;
};

UserSchema.pre("save", function (next){
    const user = this;

    //password is modified
    if(!user.isModified("password")) return next();

    //password bcrypt salt
    bcrypt.genSalt(8, (error, salt) => {
        if(error) return next(error);
        
        //hash the password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if(error) return next(error);

            //assigning hashed password
            user.password = hash;
            return next();
        })
    })
})

export const UserModel = mongoose.model('Users', UserSchema);