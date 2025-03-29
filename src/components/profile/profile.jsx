import React, { useState, useEffect } from "react";
import "./profile.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("savedJobs");
  const [fullName, setFullName] = useState("Full Name");
  const [email, setEmail] = useState("Enter email");
  const [profileImage, setProfileImage] = useState("/assets/images/profile.png");
  const [contact, setContact] = useState("Contact Number");
  const [isEditing, setIsEditing] = useState(false);

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedInternships, setSavedInternships] = useState(() => {
    return JSON.parse(localStorage.getItem("savedInternships")) || [];
  });

  const savedJobsKey = "savedJobs"; // ✅ static key

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userProfile"));
    if (userData) {
      setFullName(userData.fullName || "Full Name");
      setEmail(userData.email || "Enter email");
      setProfileImage(userData.profileImage || "/assets/images/profile.png");
      setContact(userData.contact || "Contact Number");
    }

    const saved = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
    setSavedJobs(saved);
  }, []);

  const handleSave = () => {
    const updatedProfile = { fullName, email, profileImage, contact };
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setProfileImage(imageDataUrl);
        const updatedProfile = {
          fullName,
          email,
          contact,
          profileImage: imageDataUrl,
        };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteSavedJob = (index) => {
    const updatedJobs = savedJobs.filter((_, i) => i !== index);
    setSavedJobs(updatedJobs);
    localStorage.setItem(savedJobsKey, JSON.stringify(updatedJobs));
  };

  const deleteSavedInternship = (index) => {
    const updatedInternships = [...savedInternships];
    updatedInternships.splice(index, 1);
    setSavedInternships(updatedInternships);
    localStorage.setItem("savedInternships", JSON.stringify(updatedInternships));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="full-profile">
          <div className="profile-image-container">
            <img src={profileImage} className="profile-image" alt="User Profile" />
            <label htmlFor="file-upload" className="camera-icon">
              <img src="assets/icons/camera.svg" alt="Camera" />
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-details">
            {isEditing ? (
              <>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact Number" />
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
                <p><strong>Full Name:</strong> {fullName}</p>
                <p><strong>Role:</strong> {email}</p>
                <p><strong>Contact:</strong> {contact}</p>
                <FaEdit className="edit-icon" onClick={() => setIsEditing(true)} />
              </>
            )}
          </div>
        </div>

        <div className="saved-buttons">
          <div className="section-buttons">
            <button
              className={activeSection === "savedJobs" ? "active" : ""}
              onClick={() => setActiveSection("savedJobs")}
            >
              Saved Jobs
            </button>
            <button
              className={activeSection === "savedInternships" ? "active" : ""}
              onClick={() => setActiveSection("savedInternships")}
            >
              Saved Internships
            </button>
          </div>

          <div className="content-container">
            {activeSection === "savedJobs" && (
              <div className="saved-jobs">
                {savedJobs.length === 0 ? (
                  <p>No saved jobs available.</p>
                ) : (
                  <ul>
                    {savedJobs.map((job, index) =>
                      job?.title ? (
                        <li key={index}>
                          <strong>{job.title}</strong> – {job?.location?.display_name || "Location not available"}
                          {job?.redirect_url && (
                            <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                              <div className="view-job">View Job</div>
                            </a>
                          )}
                          <FaTrash className="delete-icon" onClick={() => deleteSavedJob(index)} />
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            )}

            {activeSection === "savedInternships" && (
              <div className="saved-internships">
                {savedInternships.length === 0 ? (
                  <p>No saved internships available.</p>
                ) : (
                  <ul>
                    {savedInternships.map((internship, index) =>
                      internship?.title ? (
                        <li key={index}>
                          <strong>{internship.title}</strong> – {internship?.location?.display_name || "Location not available"}
                          {internship?.url && (
                            <a href={internship.url} target="_blank" rel="noopener noreferrer" className="view-details-link">
                              View Details
                            </a>
                          )}
                          <FaTrash className="delete-icon" onClick={() => deleteSavedInternship(index)} />
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
