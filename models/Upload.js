const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Plase add file name'],
    },
  },
  { timestamps: true },
);

const Upload = mongoose.model('Upload', userSchema);

module.exports = Upload;
