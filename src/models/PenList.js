const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const penListSchema = new Schema(
  {
    penId: {
      type: String,
      required: true,
      index:true
    },
    name:{
        type:String,
        required:true
    },
    requiredLevel:{
        type:Number,
        required:true
    },
    position:{
      type:Number
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("PenList", penListSchema);
