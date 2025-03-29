import React, { useState, useEffect } from "react";
import UserPreferences from "../../UserPreferences";
import "./Notifications.css";

const ADZUNA_APP_ID = "97c3856a";
const ADZUNA_API_KEY = "852e595657093c70c34173e1d45cba8f";
const JOOBLE_API_KEY = "473c0f27-0c89-4af6-bc44-95720915f052";

// Function to request notification permission
const requestNotificationPermission = () => {
    if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
            console.log("Notification permission:", permission);
        });
    }
};

// Function to show a push notification
const showNotification = (item) => {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`New ${item.type} Alert!`, {
            body: `${item.role} at ${item.company} in ${item.location}`,
            icon: "https://cdn-icons-png.flaticon.com/512/1004/1004736.png", // Use a job-related icon
        });
    }
};

// Fetch jobs from Adzuna API
const fetchAdzunaJobs = async (preferences) => {
    const { role, location } = preferences.job;
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${role}&where=${location}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching Adzuna jobs:", error);
        return [];
    }
};

// Fetch jobs from Jooble API
const fetchJoobleJobs = async (preferences) => {
    const { role, location } = preferences.job;
    const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: role, location })
        });
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error("Error fetching Jooble jobs:", error);
        return [];
    }
};

// Fetch internships (Example API structure, replace with actual API)
const fetchInternships = async (preferences) => {
    const { field, location } = preferences.internship;
    const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: field, location })
        });
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error("Error fetching Jooble jobs:", error);
        return [];
    }
};

// Fetch workshops (Example API structure, replace with actual API)
const fetchWorkshops = async (preferences) => {
    const { topic, location } = preferences.workshop;
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${topic}&where=${location}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error fetching Adzuna jobs:", error);
        return [];
    }
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [userPreferences, setUserPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastItems, setLastItems] = useState([]);

    const handlePreferencesUpdate = (preferences) => {
        setUserPreferences(preferences);
        localStorage.setItem("userPreferences", JSON.stringify(preferences));
        loadNotifications(preferences);
    };

    useEffect(() => {
        requestNotificationPermission();
        const savedPreferences = localStorage.getItem("userPreferences");
        if (savedPreferences) {
            const parsedPreferences = JSON.parse(savedPreferences);
            setUserPreferences(parsedPreferences);
            loadNotifications(parsedPreferences);
        } else {
            setLoading(false);
        }

        const interval = setInterval(() => {
            if (userPreferences) {
                loadNotifications(userPreferences);
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async (preferences) => {
        setLoading(true);
        if (!preferences) {
            setLoading(false);
            return;
        }

        const [adzunaJobs, joobleJobs, internships, workshops] = await Promise.all([
            fetchAdzunaJobs(preferences),
            fetchJoobleJobs(preferences),
            fetchInternships(preferences),
            fetchWorkshops(preferences)
        ]);

        const formatItems = (items, type) => items.map((item, index) => ({
            id: item.id || index + 1,
            type,
            role: item.title || item.job_title || "Unknown Role",
            company: item.company?.display_name || item.company?.name || "Unknown Company",
            location: item.location?.display_name || item.location || "Unknown Location",
            message: `${item.company?.display_name || item.company?.name || "A company"} is offering a ${type} for ${item.title || item.job_title || "a position"} in ${item.location?.display_name || item.location || "a location"}!`,
            apply_url: item.redirect_url || item.link || "#",
            posted_date: item.created || item.date || item.posted || "Unknown Date",
        }));

        const allItems = [
            ...formatItems(adzunaJobs, "Job"),
            ...formatItems(joobleJobs, "Job"),
            ...formatItems(internships, "Internship"),
            ...formatItems(workshops, "Workshop")
        ];

        const newItems = allItems.filter((item) => !lastItems.some((oldItem) => oldItem.id === item.id));
        newItems.forEach(showNotification);

        setLastItems(allItems);
        setNotifications(allItems);
        setLoading(false);
    };

    return (
        <div className="notifications-container">
            {/* User Preferences Section */}
            <div className="preferences-section">
                <UserPreferences onPreferencesUpdate={handlePreferencesUpdate} />
            </div>
    
            {/* Notifications Section */}
            <div className="notifications-section">
                <h2>Personal Recommendations</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id}>
                                <p>{notification.message} </p>
                                
                                {/* Company Name & Location in Bold */}
                                <p>
                                    <strong>Company:</strong> {notification.company}<br/>
                                    <strong>Location: </strong>
                                    {notification.location}
                                </p>
    
                                <a href={notification.apply_url} target="_blank" rel="noopener noreferrer">Apply</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notifications available based on your preferences.</p>
                )}
            </div>
        </div>
    );
    
    
};

export default Notifications;
