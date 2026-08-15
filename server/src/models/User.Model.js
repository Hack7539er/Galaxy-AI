import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

/**
 * @name UserSchema
 * @description MongoDB schema for User collection with password hashing pre-save hook
 * @type {Schema}
 * @property {String} name - User's full name, unique and required
 * @property {String} email - User's email address, unique, required, lowercase and trimmed
 * @property {String} password - User's password (hashed before saving)
 * @property {Date} createdAt - Timestamp of when user was created (auto-generated)
 * @property {Date} updatedAt - Timestamp of when user was last updated (auto-generated)
 */
const UserSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

/**
 * @name pre-save hook
 * @description Pre-save middleware that hashes password before storing in database
 * Uses bcrypt with salt rounds of 10 for secure password storage
 * Only hashes if password field has been modified
 */
UserSchema.pre("save", async function() {

    if (!this.isModified("password")) return;

    const salt = await genSalt(10);

    this.password = await hash(this.password, salt);
});

/**
 * @name comparePassword
 * @description Instance method to compare plaintext password with hashed password in database
 * @async
 * @param {String} password - Plaintext password to compare
 * @returns {Promise<Boolean>} True if password matches, false otherwise
 * @example
 * const user = await userModel.findById(userId);
 * const isPasswordValid = await user.comparePassword("user-password");
 */
UserSchema.methods.comparePassword = async function(password) { 
    return compare(password, this.password);
};

/**
 * @name userModel
 * @description MongoDB User model
 * @type {Model}
 */
const userModel = model("User", UserSchema);

export default userModel;