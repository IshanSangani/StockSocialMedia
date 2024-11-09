import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Profile } from "../models/profileSchema.js";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists.",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 16);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // Create profile for new user
        await Profile.create({
            userId: newUser._id,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        };
        
        // Populate profile data
        const user = await User.findOne({ email }).populate('profile');
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }
        
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user logged out successfully.",
        success: true
    })
}
export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        const profile = await Profile.findOne({ userId: id });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            user,
            profile
        });
    } catch (error) {
        console.log(error);
    }
};

export const getOtherUsers = async (req, res) => { 
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
        const profiles = await Profile.find({ userId: { $in: otherUsers.map(user => user._id) } });
        
        if (otherUsers.length === 0) {
            return res.status(401).json({
                message: "Currently do not have any users."
            });
        };
        
        const usersWithProfiles = otherUsers.map(user => {
            const profile = profiles.find(profile => profile.userId.toString() === user._id.toString());
            return { user, profile };
        });

        return res.status(200).json({
            usersWithProfiles
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture, bannerImage } = req.body;
        const userId = req.user._id;

        

        // Find and update profile instead of user
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId }, // find profile by userId
            { 
                $set: { 
                    bio, 
                    profilePicture, 
                    bannerImage 
                }
            },
            { 
                new: true,
                upsert: true, // create if doesn't exist
                runValidators: true
            }
        );

        

        if (!updatedProfile) {
            return res.status(400).json({
                message: "Failed to update profile",
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile,
            success: true
        });

    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({
            message: "Error updating profile",
            error: error.message,
            success: false
        });
    }
};

export const follow = async(req,res)=>{
    try {
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$push:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User already followed to ${user.name}`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
export const unfollow = async (req,res) => {
    try {
        const loggedInUserId = req.body.id; 
        const userId = req.params.id; 
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}});
            await loggedInUser.updateOne({$pull:{following:userId}});
        }else{
            return res.status(400).json({
                message:`User has not followed yet`
            })
        };
        return res.status(200).json({
            message:`${loggedInUser.name} unfollow to ${user.name}`,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}