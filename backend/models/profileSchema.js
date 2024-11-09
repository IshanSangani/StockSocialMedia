import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: "default-profile.png" // Path to a default profile picture
    },
    bannerImage: {
        type: String,
        default: "default-banner.png" // Path to a default banner image
    },
}, { timestamps: true });

export const Profile = mongoose.model("Profile", profileSchema);
