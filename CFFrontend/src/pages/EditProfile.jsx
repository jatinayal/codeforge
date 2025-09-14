import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Calendar, Save, ArrowLeft, CheckCircle, Link } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../authSlice';

const profileSchema = z.object({
  firstName: z.string()
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must be at most 20 characters"),
  lastName: z.string()
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name must be at most 20 characters")
    .optional()
    .or(z.literal('')),
  image: z.string()
    .url("Please enter a valid URL") // Changed to URL validation
    .optional()
    .or(z.literal('')),
  age: z.union([
    z.number().min(6, "Age must be at least 6").max(80, "Age must be at most 80"),
    z.null(), // Allow null values
    z.undefined() // Allow undefined values
  ]).optional() // Make age truly optional
});

const EditProfile = ({ onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser, profileUpdateLoading, profileUpdateError } = useSelector((state) => state.auth);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
    setValue
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: authUser?.firstName || '',
      lastName: authUser?.lastName || '',
      image: authUser?.image || '',
      age: authUser?.age || ''
    }
  });

  // Set form values when user data is available
  useEffect(() => {
    if (authUser) {
      reset({
        firstName: authUser.firstName,
        lastName: authUser.lastName || '',
        image: authUser.image || '',
        age: authUser.age || ''
      });
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

  const onSubmit = async (data) => {
    try {
      // Prepare data for API
      const updateData = {
        firstName: data.firstName,
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.image && { image: data.image }),
        ...(data.age && { age: Number(data.age) })
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
              disabled={profileUpdateLoading}
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
                disabled={profileUpdateLoading || updateSuccess}
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
                disabled={profileUpdateLoading || updateSuccess}
              />
            </label>
            {errors.lastName && (
              <p className="text-red-500 text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
              <Link size={20} className="text-gray-400" />
              <input
                {...register("image")}
                type="text"
                placeholder="Image URL (Optional) *Direct upload comming soon"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                disabled={profileUpdateLoading || updateSuccess}
              />
            </label>
            {errors.image && (
              <p className="text-red-500 text-sm">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Age - Now Truly Optional */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
              <Calendar size={20} className="text-gray-400" />
              <input
                {...register("age", { 
                  setValueAs: v => v === "" ? undefined : parseInt(v, 10)
                })}
                type="number"
                placeholder="Age (Optional)"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                min="6"
                max="80"
                disabled={profileUpdateLoading || updateSuccess}
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
                disabled={profileUpdateLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={profileUpdateLoading || updateSuccess}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {profileUpdateLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
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
      </div>
    </div>
  );
};

export default EditProfile;