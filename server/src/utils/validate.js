import mongoose from "mongoose"

const isValidId = (id) => {
return mongoose.Types.ObjectId.isValidId(id);
} 

export {isValidId}