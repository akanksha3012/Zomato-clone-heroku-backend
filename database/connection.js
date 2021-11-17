import Mongoose from "mongoose";

export default async () => {
    return Mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
    });
};


// ,{
//     useNewUrlParser: true,
//     userUnofiedTopology: true,
//     useCreateIndex: true,
//     useFindAndmodify: true,
// }