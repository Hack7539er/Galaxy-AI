import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

// === User Schema For MongoDB Model === //
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

// === Hash Password Before Saving === //
UserSchema.pre("save", async () => {

    if (!this.isModifid("password")) return;

    const salt = await genSalt(10);

    this.password = await hash(this.password, salt);
});

// === Compare Password For Compare Hash Password And Normal Password === //
UserSchema.methods.comparePassword = async password => compare(password, this.password);

// === Create Model Use User Schema === //
const userModel = model("User", UserSchema);

// === Export Model === //
export default userModel;