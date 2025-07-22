import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import { getMe } from "../../api/UserRequest";
import { editProfile } from "../../actions/UserAction";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useDispatch } from "react-redux";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await getMe();
        const userData = res.data?.data?.user;
        if (userData) {
          setUser(userData);
          setFormData({ bio: userData.bio || "" });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchMyProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    setFormData({ bio: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("bio", formData.bio);
    if (selectedImage) {
      formPayload.append("profilePicture", selectedImage);
    }

    await dispatch(editProfile(formPayload));

    setUser((prev) => ({
      ...prev,
      bio: formData.bio,
      profilePicture: selectedImage
        ? URL.createObjectURL(selectedImage)
        : prev.profilePicture,
    }));

    setIsEditing(false);
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="ProfileCard">
      <div className="coverColor" style={{ backgroundColor: "#000" }} />

      <div className="ProfileImages">
        {selectedImage ? (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="new profile"
            className="profileImage"
          />
        ) : user.profilePicture ? (
          <img src={user.profilePicture} alt="profile" className="profileImage" />
        ) : (
          <ImageOutlinedIcon style={{ fontSize: 100, color: "#888" }} />
        )}
      </div>

      <div className="ProfileName">
        <span>{user.username}</span>
      </div>

      <hr className="horizontalLine" />

      {!isEditing ? (
        <>
          <div className="bioSection">
            <div className="bioContent">{user.bio || "No bio yet"}</div>
          </div>

          <div className="followStatus">
            <hr />
            <div>
              <div className="follow">
                <span>{user.following?.length || 0}</span>
                <span>Following</span>
              </div>
              <div className="vl" />
              <div className="follow">
                <span>{user.followers?.length || 0}</span>
                <span>Followers</span>
              </div>
            </div>
            <hr />
          </div>

          <button className="editButton" onClick={handleEdit}>
            Edit Profile
          </button>
        </>
      ) : (
        <form className="editForm" onSubmit={handleSave} encType="multipart/form-data">
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            rows={3}
            style={{ resize: "none" }}
          />

          <input
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={handleImageChange}
          />

          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default ProfileCard;
