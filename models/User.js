const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false, required: true},
    username: { type: String, required: true, unique: true },
    excuses: [{ type: Schema.Types.ObjectId, ref: "Excuse" }],
},
    { timestamps: { createdAt: 'created_at' } }
);

UserSchema.plugin(uniqueValidator);

// Must use function here! ES6 => functions do not bind this!
UserSchema.pre("save", function (next) {
    // ENCRYPT PASSWORD
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

// Need to use function to enable this.password to work.
UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
