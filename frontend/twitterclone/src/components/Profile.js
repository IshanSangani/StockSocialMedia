// Profile.js
import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast"
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

const EditProfileModal = ({ isOpen, onClose, profile }) => {
    const [formData, setFormData] = useState({
        bio: profile?.bio || '',
        profilePicture: profile?.profilePicture || '',
        bannerImage: profile?.bannerImage || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${USER_API_END_POINT}/update-profile`, formData);
            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[500px]">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Profile Picture URL</label>
                        <input
                            type="text"
                            value={formData.profilePicture}
                            onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Banner Image URL</label>
                        <input
                            type="text"
                            value={formData.bannerImage}
                            onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    useGetProfile(id);

    const followAndUnfollowHandler = async () => {
        if(user.following.includes(id)){
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profile?.name}</h1>
                        <p className='text-gray-500 text-sm'>10 post</p>
                    </div>
                </div>
                <img src={profile?.bannerImage || "https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360"} alt="banner" />
                <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
                    <Avatar src={profile?.profilePicture || "https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg"} size="120" round={true} />
                </div>
                <div className='text-right m-4'>
                    {profile?._id === user?._id ? (
                        <button 
                            onClick={() => setIsEditModalOpen(true)} 
                            className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button 
                            onClick={followAndUnfollowHandler} 
                            className='px-4 py-1 bg-black text-white rounded-full'
                        >
                            {user.following.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-xl'>{profile?.name}</h1>
                    <p>{`@${profile?.username}`}</p>
                </div>
                <div className='m-4 text-sm'>
                    <p>{profile?.bio || "🌐 Exploring the web's endless possibilities with MERN Stack 🚀 | Problem solver by day, coder by night 🌙 | Coffee lover ☕ | Join me on this coding journey!"}</p>
                </div>
            </div>
            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
            />
        </div>
    )
}

export default Profile;