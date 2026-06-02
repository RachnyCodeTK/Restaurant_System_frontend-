import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./ProfileSetting.css";

export default function ProfileSetting() {
  // =========================
  // PROFILE DATA
  // =========================
  const [profile, setProfile] = useState({
    fullName: "Rachny TK",
    email: "rachnytk@gmail.com",
    phone: "+855 12 345 678",
    role: "Store Manager",
    address: "Phnom Penh, Cambodia",
    bio: "Experienced store manager with inventory and sales management skills.",
    image:
      "https://i.pravatar.cc/300?img=12",
  });

  // EDIT MODE
  const [isEditing, setIsEditing] = useState(false);

  // TEMP DATA
  const [tempProfile, setTempProfile] =
    useState(profile);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // IMAGE UPLOAD
  // =========================  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setTempProfile({
        ...tempProfile,
        image: URL.createObjectURL(file),
      });
    }
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);

    alert("Profile Updated Successfully");
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="profile-setting">
      <Sidebar />
      <div className="header-pass">
        <Header />
        {/* HEADER */}
        <div className="page-header">
          <div>
            <h1>Profile Settings</h1>
            <p>
              Manage your account information
            </p>
          </div>

          {!isEditing ? (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Setting
            </button>
          ) : (
            <div className="header-buttons">
              <button
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* MAIN CARD */}
        <div className="profile-card">
          {/* PROFILE IMAGE */}
          <div className="profile-image-section">
            <img
              src={tempProfile.image}
              alt="Profile"
            />

            {isEditing && (
              <label className="upload-btn">
                Upload Photo

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* PROFILE DETAILS */}
          <div className="profile-content">
            <div className="info-grid">
              {/* FULL NAME */}
              <div className="input-group">
                <label>Full Name</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={tempProfile.fullName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.fullName}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <label>Email</label>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempProfile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              {/* PHONE */}
              <div className="input-group">
                <label>Phone</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={tempProfile.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>

              {/* ROLE */}
              <div className="input-group">
                <label>Role</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="role"
                    value={tempProfile.role}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.role}</p>
                )}
              </div>

              {/* ADDRESS */}
              <div className="input-group full-width">
                <label>Address</label>

                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempProfile.address}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>

              {/* BIO */}
              <div className="input-group full-width">
                <label>Bio</label>

                {isEditing ? (
                  <textarea
                    rows="4"
                    name="bio"
                    value={tempProfile.bio}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}