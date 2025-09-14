import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Calendar, Save, ArrowLeft, CheckCircle, Upload, X, Image, Loader, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../authSlice';
import axiosClient from '../utils/axiosClient';

const profileSchema = z.object({
  firstName: z.string()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must be at most 20 characters"),
  lastName: z.string()
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name must be at most 20 characters")
    .optional()
    .or(z.literal('')),
  age: z.number()
    .min(6, "Age must be at least 6")
    .max(80, "Age must be at most 80")
    .optional()
    .or(z.literal(''))
});

const EditProfile = ({ onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser, profileUpdateLoading, profileUpdateError } = useSelector((state) => state.auth);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: authUser?.firstName || '',
      lastName: authUser?.lastName || '',
      age: authUser?.age || ''
    }
  });

  // Set form values and image preview when user data is available
  useEffect(() => {
    if (authUser) {
      reset({
        firstName: authUser.firstName,
        lastName: authUser.lastName || '',
        age: authUser.age || ''
      });
      
      if (authUser.profileImage) {
        setImagePreview(authUser.profileImage);
      }
    }
  }, [authUser, reset]);

  // Handle API errors
  useEffect(() => {
    if (profileUpdateError) {
      setFormError('root', { 
        type: 'server', 
        message: profileUpdateError 
      });
      setUpdateSuccess(false);
    }
  }, [profileUpdateError, setFormError]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setUploadError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(authUser?.profileImage || null);
    setUploadError(null);
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploadLoading(true);
    setUploadError(null);

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get('/image/create');
      const signatureData = signatureResponse.data;

      // Step 2: Upload image to Cloudinary using the signature
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('api_key', signatureData.api_key);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('signature', signatureData.signature);
      formData.append('public_id', signatureData.public_id);

      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!cloudinaryResponse.ok) {
        const errorText = await cloudinaryResponse.text();
        console.error('Cloudinary upload error:', errorText);
        throw new Error('Failed to upload image to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();

      // Step 3: Save image metadata to our backend
      await axiosClient.post('/users/save-image-metadata', {
        cloudinaryPublicId: signatureData.public_id,
        secureUrl: cloudinaryData.secure_url
      });

      return cloudinaryData.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(error.response?.data?.error || error.message || 'Failed to upload image');
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete profile image
  const deleteProfileImage = async () => {
    try {
      await axiosClient.delete('/users/delete-profile-image');
      setImagePreview(null);
      setDeleteModal({ isOpen: false });
      // Update the user in the store if needed
      if (authUser) {
        dispatch(updateUserProfile({ ...authUser, profileImage: null }));
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      setUploadError(error.response?.data?.error || error.message || 'Failed to delete image');
    }
  };

  const onSubmit = async (data) => {
    try {
      let profileImageUrl = authUser?.profileImage;
      
      // Upload new image if selected
      if (selectedImage) {
        profileImageUrl = await uploadImage();
        if (!profileImageUrl) {
          // Don't proceed if image upload failed
          return;
        }
      }

      // Prepare data for API
      const updateData = {
        firstName: data.firstName,
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.age && { age: Number(data.age) }),
        ...(profileImageUrl && { profileImage: profileImageUrl })
      };
      
      // Dispatch the update action
      await dispatch(updateUserProfile(updateData)).unwrap();
      
      // Show success message
      setUpdateSuccess(true);
      
      // Close the form after successful update if onCancel callback provided
      if (onCancel) {
        setTimeout(() => {
          onCancel();
        }, 2000);
      }
    } catch (error) {
      // Error is already handled by the authSlice
      console.error('Profile update error:', error);
      setUpdateSuccess(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteModal({ isOpen: true });
  };

  const closeModal = () => {
    setDeleteModal({ isOpen: false });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full p-6 bg-[#0a0a0a] border border-[#333333] rounded-xl shadow-xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              disabled={profileUpdateLoading || uploadLoading}
            >
              <ArrowLeft size={20} />
            </button>
          )}
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-500 rounded-lg flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Profile updated successfully!
          </div>
        )}

        {/* Profile Image Upload */}
        <div className="mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#333333] flex items-center justify-center bg-[#111111]">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image size={40} className="text-gray-400" />
                )}
              </div>
              
              {selectedImage && (
                <button
                  onClick={removeSelectedImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  disabled={uploadLoading}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg cursor-pointer hover:bg-yellow-600 transition-colors disabled:opacity-50">
                <Upload size={16} />
                {selectedImage ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={uploadLoading}
                />
              </label>
              
              {authUser?.profileImage && (
                <button
                  onClick={openDeleteModal}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={uploadLoading}
                >
                  <X size={16} />
                  Remove
                </button>
              )}
            </div>
            
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}
            
            {uploadLoading && (
              <div className="mt-2 flex items-center text-yellow-500">
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Uploading image...
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
              <User size={20} className="text-gray-400" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="First Name"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                disabled={profileUpdateLoading || updateSuccess || uploadLoading}
              />
            </label>
            {errors.firstName && (
              <p className="text-red-500 text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
              <UserPlus size={20} className="text-gray-400" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Last Name (Optional)"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                disabled={profileUpdateLoading || updateSuccess || uploadLoading}
              />
            </label>
            {errors.lastName && (
              <p className="text-red-500 text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
              <Calendar size={20} className="text-gray-400" />
              <input
                {...register("age", { valueAsNumber: true })}
                type="number"
                placeholder="Age (Optional)"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                min="6"
                max="80"
                disabled={profileUpdateLoading || updateSuccess || uploadLoading}
              />
            </label>
            {errors.age && (
              <p className="text-red-500 text-sm">
                {errors.age.message}
              </p>
            )}
          </div>

          {/* Server Error Message */}
          {errors.root && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg">
              {errors.root.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-xl border border-[#333333] hover:border-gray-500 transition-colors"
                disabled={profileUpdateLoading || uploadLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={profileUpdateLoading || updateSuccess || uploadLoading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {profileUpdateLoading || uploadLoading ? (
                <Loader className="animate-spin h-5 w-5 border-b-2 border-black" />
              ) : updateSuccess ? (
                <>
                  <CheckCircle size={18} />
                  Success!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Delete Image Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full p-6 bg-[#0a0a0a] border border-[#333333] rounded-xl shadow-xl">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-red-500/10 p-2 mr-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Delete Profile Image</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete your profile image? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-[#333333] text-gray-300 rounded-xl hover:bg-[#1a1a1a]"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProfileImage}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;