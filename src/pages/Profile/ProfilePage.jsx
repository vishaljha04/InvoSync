// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { User, Mail, Building, MapPin, Phone, Save, LogOut, Edit2, Shield, Calendar, Globe, CheckCircle, AlertCircle } from 'lucide-react';
// import Button from '../../components/ui/Button';
// import Inputfield from '../../components/ui/Inputfield';
// import TextAreaField from '../../components/ui/TextAreaField';
// import axiosInstance from '../../utils/axiosInstance';
// import { API_PATHS } from '../../utils/apiPath';
// import toast from 'react-hot-toast';

// const ProfilePage = () => {
//     const { user, logout, updateUser } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         businessName: '',
//         address: '',
//         phone: '',
//     });

//     // Initialize form data when user loads
//     useEffect(() => {
//         if (user) {
//             setFormData({
//                 name: user.name || '',
//                 email: user.email || '',
//                 businessName: user.businessName || '',
//                 address: user.address || '',
//                 phone: user.phone || '',
//             });
//         }
//     }, [user]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await axiosInstance.put(
//                 API_PATHS.AUTH.UPDATE_PROFILE,
//                 formData
//             );

//             if (response.data) {
//                 updateUser(response.data);
//                 toast.success('Profile updated successfully! 🎉');
//                 setIsEditing(false);
//             }
//         } catch (error) {
//             console.error('Update error:', error);
//             toast.error('Failed to update profile');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         if (window.confirm('Are you sure you want to logout?')) {
//             logout();
//             toast.success('Logged out successfully');
//         }
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
//                 <div className="text-center">
//                     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <User className="w-10 h-10 text-blue-600" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Profile...</h2>
//                     <p className="text-slate-600">Please wait while we load your information</p>
//                 </div>
//             </div>
//         );
//     }

//     const userCreatedDate = user._id ? new Date(parseInt(user._id.substring(0, 8), 16) * 1000) : new Date();

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-6 sm:mb-8">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                         <div>
//                             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Profile</h1>
//                             <p className="text-slate-600 mt-2">Manage your account information and settings</p>
//                         </div>
//                         <div className="flex gap-2">
//                             {!isEditing && (
//                                 <Button
//                                     varient="secondary"
//                                     onClick={() => setIsEditing(true)}
//                                     icon={Edit2}
//                                     className="whitespace-nowrap"
//                                 >
//                                     Edit Profile
//                                 </Button>
//                             )}
//                             <Button
//                                 varient="ghost"
//                                 onClick={handleLogout}
//                                 icon={LogOut}
//                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                             >
//                                 Logout
//                             </Button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Column - Profile Card */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//                             {/* Profile Picture */}
//                             <div className="flex flex-col items-center mb-6">
//                                 <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
//                                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center">
//                                         <User className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
//                                     </div>
//                                 </div>
//                                 <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
//                                     {user.name}
//                                 </h2>
//                                 <p className="text-slate-600 text-sm sm:text-base">{user.email}</p>
//                                 {user.businessName && (
//                                     <p className="text-blue-600 font-medium mt-2">
//                                         {user.businessName}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Account Info */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <Shield className="w-5 h-5 text-blue-600" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-medium text-slate-900">Account Status</p>
//                                         <p className="text-xs text-slate-600 flex items-center gap-1">
//                                             <CheckCircle className="w-3 h-3 text-emerald-500" />
//                                             Active
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <Calendar className="w-5 h-5 text-blue-600" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-medium text-slate-900">Member Since</p>
//                                         <p className="text-xs text-slate-600">
//                                             {userCreatedDate.toLocaleDateString('en-US', {
//                                                 month: 'long',
//                                                 year: 'numeric'
//                                             })}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <Globe className="w-5 h-5 text-blue-600" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-medium text-slate-900">User ID</p>
//                                         <p className="text-xs text-slate-600 font-mono truncate">
//                                             {user._id?.substring(0, 8)}...
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Quick Stats */}
//                             <div className="mt-6 pt-6 border-t border-slate-200">
//                                 <h3 className="text-sm font-semibold text-slate-900 mb-3">Account Overview</h3>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div className="p-3 bg-emerald-50 rounded-lg">
//                                         <p className="text-xs text-emerald-800 font-medium">Invoices</p>
//                                         <p className="text-lg font-bold text-emerald-900">-</p>
//                                     </div>
//                                     <div className="p-3 bg-blue-50 rounded-lg">
//                                         <p className="text-xs text-blue-800 font-medium">Clients</p>
//                                         <p className="text-lg font-bold text-blue-900">-</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column - Edit Form */}
//                     <div className="lg:col-span-2">
//                         {isEditing ? (
//                             // Edit Form
//                             <form onSubmit={handleSubmit} className="space-y-6">
//                                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//                                     <div className="flex items-center justify-between mb-6">
//                                         <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
//                                             Edit Profile Information
//                                         </h3>
//                                         <div className="flex gap-2">
//                                             <Button
//                                                 type="button"
//                                                 varient="ghost"
//                                                 onClick={() => setIsEditing(false)}
//                                                 disabled={loading}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                             <Button
//                                                 type="submit"
//                                                 isLoading={loading}
//                                                 icon={Save}
//                                             >
//                                                 Save Changes
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-5">
//                                         {/* Personal Info */}
//                                         <div>
//                                             <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
//                                                 <User className="w-4 h-4" />
//                                                 Personal Information
//                                             </h4>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                                 <Inputfield
//                                                     label="Full Name"
//                                                     name="name"
//                                                     value={formData.name}
//                                                     onChange={handleInputChange}
//                                                     icon={User}
//                                                     required
//                                                     disabled={loading}
//                                                 />
//                                                 <Inputfield
//                                                     label="Email Address"
//                                                     type="email"
//                                                     name="email"
//                                                     value={formData.email}
//                                                     onChange={handleInputChange}
//                                                     icon={Mail}
//                                                     required
//                                                     disabled
//                                                     className="bg-slate-50"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Business Info */}
//                                         <div>
//                                             <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
//                                                 <Building className="w-4 h-4" />
//                                                 Business Information
//                                             </h4>
//                                             <div className="space-y-4">
//                                                 <Inputfield
//                                                     label="Business Name"
//                                                     name="businessName"
//                                                     value={formData.businessName}
//                                                     onChange={handleInputChange}
//                                                     icon={Building}
//                                                     placeholder="Your business or company name"
//                                                     disabled={loading}
//                                                 />
                                                
//                                                 <TextAreaField
//                                                     label="Business Address"
//                                                     name="address"
//                                                     value={formData.address}
//                                                     onChange={handleInputChange}
//                                                     icon={MapPin}
//                                                     placeholder="Enter your business address"
//                                                     rows={3}
//                                                     disabled={loading}
//                                                 />
                                                
//                                                 <Inputfield
//                                                     label="Phone Number"
//                                                     name="phone"
//                                                     value={formData.phone}
//                                                     onChange={handleInputChange}
//                                                     icon={Phone}
//                                                     placeholder="+1 (555) 123-4567"
//                                                     disabled={loading}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Form Tips */}
//                                         <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//                                             <div className="flex items-start gap-3">
//                                                 <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                                                 <div>
//                                                     <p className="text-sm font-medium text-blue-800 mb-1">
//                                                         Profile Information Tips
//                                                     </p>
//                                                     <ul className="text-xs text-blue-700 space-y-1">
//                                                         <li>• Business information will appear on your invoices</li>
//                                                         <li>• Keep your contact details up to date</li>
//                                                         <li>• Email cannot be changed for security reasons</li>
//                                                     </ul>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </form>
//                         ) : (
//                             // View Mode
//                             <div className="space-y-6">
//                                 {/* Personal Info Card */}
//                                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//                                     <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">
//                                         Personal Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
//                                             <div className="p-2 bg-blue-100 rounded-lg">
//                                                 <User className="w-5 h-5 text-blue-600" />
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="text-sm text-slate-500">Full Name</p>
//                                                 <p className="font-medium text-slate-900">{user.name}</p>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
//                                             <div className="p-2 bg-blue-100 rounded-lg">
//                                                 <Mail className="w-5 h-5 text-blue-600" />
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="text-sm text-slate-500">Email Address</p>
//                                                 <p className="font-medium text-slate-900">{user.email}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Business Info Card */}
//                                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//                                     <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">
//                                         Business Information
//                                     </h3>
//                                     <div className="space-y-4">
//                                         {user.businessName ? (
//                                             <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
//                                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                                     <Building className="w-5 h-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="text-sm text-slate-500">Business Name</p>
//                                                     <p className="font-medium text-slate-900">{user.businessName}</p>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
//                                                 <p className="text-sm text-amber-800">
//                                                     No business name set. Add one to appear on invoices.
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {user.address ? (
//                                             <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
//                                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                                     <MapPin className="w-5 h-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="text-sm text-slate-500">Business Address</p>
//                                                     <p className="font-medium text-slate-900">{user.address}</p>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
//                                                 <p className="text-sm text-amber-800">
//                                                     No address set. Add your business address.
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {user.phone ? (
//                                             <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
//                                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                                     <Phone className="w-5 h-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="text-sm text-slate-500">Phone Number</p>
//                                                     <p className="font-medium text-slate-900">{user.phone}</p>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
//                                                 <p className="text-sm text-amber-800">
//                                                     No phone number set. Add your contact number.
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Account Settings Card */}
//                                 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
//                                     <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">
//                                         Account Settings
//                                     </h3>
//                                     <div className="space-y-3">
//                                         <button
//                                             onClick={() => toast.info('Password change feature coming soon!')}
//                                             className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-2 bg-slate-100 rounded-lg">
//                                                     <Shield className="w-5 h-5 text-slate-600" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-slate-900">Change Password</p>
//                                                     <p className="text-sm text-slate-600">Update your account password</p>
//                                                 </div>
//                                             </div>
//                                             <span className="text-slate-400">→</span>
//                                         </button>

//                                         <button
//                                             onClick={() => toast.info('Notifications settings coming soon!')}
//                                             className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-2 bg-slate-100 rounded-lg">
//                                                     <Mail className="w-5 h-5 text-slate-600" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-slate-900">Notification Settings</p>
//                                                     <p className="text-sm text-slate-600">Manage email notifications</p>
//                                                 </div>
//                                             </div>
//                                             <span className="text-slate-400">→</span>
//                                         </button>

//                                         <button
//                                             onClick={handleLogout}
//                                             className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-left group"
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200">
//                                                     <LogOut className="w-5 h-5 text-red-600" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-red-700">Logout Account</p>
//                                                     <p className="text-sm text-red-600">Sign out from your account</p>
//                                                 </div>
//                                             </div>
//                                             <span className="text-red-400">→</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Footer Note */}
//                 <div className="mt-6 text-center">
//                     <p className="text-xs text-slate-500">
//                         Last updated: {new Date().toLocaleDateString('en-US', {
//                             month: 'long',
//                             day: 'numeric',
//                             year: 'numeric'
//                         })}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfilePage;