import mongoose from "mongoose";

const conn = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "setree",
      useNewUrlParser: true,
      //useUnifinedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB successfully! :)");
    })
    .catch((err) => {
      console.log(`Error occured while connecting to DB : ${err} `);
    });
};

export default conn;
