import mongoose from "mongoose";

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) &&
         String(new mongoose.Types.ObjectId(id)) === id;
};

export { isValidId };