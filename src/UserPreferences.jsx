import React, { useState, useEffect } from "react";
import "./UserPreferences.css";

const UserPreferences = () => {
    const defaultPreferences = {
        job: { role: "", company: "", location: "" },
        internship: { role: "", company: "", location: "" },
        workshop: { role: "", company: "", location: "" }
    };

    const [preferences, setPreferences] = useState(defaultPreferences);
    const [expanded, setExpanded] = useState({ job: false, internship: false, workshop: false });

    // Load preferences from Local Storage on component mount
    useEffect(() => {
        const savedPreferences = localStorage.getItem("userPreferences");
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    // Handle input change
    const handleChange = (category, field, value) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    // Save preferences to Local Storage
    const savePreferences = () => {
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
        alert("Preferences saved successfully!");
    };

    // Reset preferences to default values with confirmation
    const resetPreferences = () => {
        if (window.confirm("Are you sure you want to reset your preferences?")) {
            localStorage.removeItem("userPreferences"); // Clear localStorage
            setPreferences(defaultPreferences); // Reset state
            alert("Preferences have been reset.");
        }
    };
    const UserPreferences = ({ onPreferencesUpdate }) => {
        // After saving preferences, call the parent function
        const savePreferences = () => {
            localStorage.setItem("userPreferences", JSON.stringify(preferences));
            alert("Preferences saved successfully!");
            onPreferencesUpdate(preferences); // Pass updated preferences to Notifications
        };
    };


    return (
        <div>
            <h2>User Preferences</h2>

            {/* Job Preferences */}
            <div>
                <h3 onClick={() => setExpanded({ ...expanded, job: !expanded.job })} style={{ cursor: "pointer" }}>
                    <button className="job-button">                    Job Preferences {expanded.job ? "▲" : "▼"}
                    </button>
                </h3>
                {expanded.job && (
                    <div className="preferences">
                        <input type="text" placeholder="Role" value={preferences.job.role} onChange={(e) => handleChange("job", "role", e.target.value)} className="filter-fields" />
                        <input type="text" placeholder="Company" value={preferences.job.company} onChange={(e) => handleChange("job", "company", e.target.value)} className="filter-fields" />
                        <input type="text" placeholder="Location" value={preferences.job.location} onChange={(e) => handleChange("job", "location", e.target.value)} className="filter-fields"/>
                    </div>
                )}
            </div>

            {/* Internship Preferences */}
            <div>
                <h3 onClick={() => setExpanded({ ...expanded, internship: !expanded.internship })} style={{ cursor: "pointer" }}>
                    <button className="internship-button">
                        Internship Preferences {expanded.internship ? "▲" : "▼"}

                    </button>                </h3>
                {expanded.internship && (
                    <div className="preferences">
                        <input type="text" placeholder="Role" value={preferences.internship.role} onChange={(e) => handleChange("internship", "role", e.target.value)} className="filter-fields"/>
                        <input type="text" placeholder="Company" value={preferences.internship.company} onChange={(e) => handleChange("internship", "company", e.target.value)} className="filter-fields"/>
                        <input type="text" placeholder="Location" value={preferences.internship.location} onChange={(e) => handleChange("internship", "location", e.target.value)} className="filter-fields" />
                    </div>
                )}
            </div>

            {/* Workshop Preferences */}
            <div>
                <h3 onClick={() => setExpanded({ ...expanded, workshop: !expanded.workshop })} style={{ cursor: "pointer" }}>
                    <button className="workshop-button">                    Workshop Preferences {expanded.workshop ? "▲" : "▼"}
                    </button>                </h3>
                {expanded.workshop && (
                    <div className="preferences">
                        <input type="text" placeholder="Topic" value={preferences.workshop.role} onChange={(e) => handleChange("workshop", "role", e.target.value)} className="filter-fields"/>
                        <input type="text" placeholder="Organizer" value={preferences.workshop.company} onChange={(e) => handleChange("workshop", "company", e.target.value)} className="filter-fields"/>
                        <input type="text" placeholder="Location" value={preferences.workshop.location} onChange={(e) => handleChange("workshop", "location", e.target.value)} className="filter-fields"/>
                    </div>
                )}
            </div>

            <button onClick={savePreferences} className="save-button" >Save Preferences</button>
            <button onClick={resetPreferences} className="reset-button" >
                Reset Preferences
            </button>
        </div>
    );
};

export default UserPreferences;
