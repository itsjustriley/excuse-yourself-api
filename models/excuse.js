const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExcuseSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  excuse: { type: String, required : true },
  tags: [{ type: String }],
},
  { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model("Excuse", ExcuseSchema);