import React, { useState, useEffect, useRef } from "react";
import "./JobList.css";

const UNavbar = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ location: "", company: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    const [savedJobs, setSavedJobs] = useState([]);

    const appId = "97c3856a";
    const appKey = "852e595657093c70c34173e1d45cba8f";

    const savedJobsKey = "savedJobs"; // ✅ Use fixed key

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(
                    `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=100`
                );
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data.results);
                    setFilteredJobs(data.results);
                } else {
                    setError("Error fetching jobs from Adzuna");
                }
            } catch (err) {
                setError("Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(savedJobsKey)) || [];
        setSavedJobs(saved);
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (filters.company) {
            filtered = filtered.filter(job =>
                (job.company?.display_name || "").toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.location) {
            filtered = filtered.filter(job =>
                (job.location?.display_name || "").toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.company?.display_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.location?.display_name || "").toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    }, [filters, searchQuery, jobs]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const isJobSaved = (jobId) => {
        return savedJobs.some((job) => job.id === jobId);
    };

    const toggleSaveJob = (job) => {
        let updatedSavedJobs;

        if (isJobSaved(job.id)) {
            updatedSavedJobs = savedJobs.filter((j) => j.id !== job.id);
        } else {
            updatedSavedJobs = [...savedJobs, job];
        }

        setSavedJobs(updatedSavedJobs);
        localStorage.setItem(savedJobsKey, JSON.stringify(updatedSavedJobs));
    };

    const highlightText = (text, searchTerm) => {
        if (!text) return "";
        if (!searchTerm) return text;

        const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="job-page">
            <nav className="Upper-navbar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="jobs-title">
                        <h1>JOBS</h1>
                    </div>
                </div>

                <div className="filter-container" ref={filterRef}>
                    <button
                        className="filter-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <img src="../../assets/icons/filter.svg" alt="Filter" className="filter-icon" />
                        <span className="filter-text">FILTER</span>
                    </button>

                    {showFilters && (
                        <div className="filter-dropdown">
                            <label>
                                Company:
                                <input
                                    type="text"
                                    name="company"
                                    value={filters.company}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </nav>

            <div className="mainpage">
                {loading ? (
                    <p>Loading jobs...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredJobs.length > 0 ? (
                    <div className="job-list">
                        {filteredJobs.map((job, index) => (
                            <div key={index} className="job-card">
                                <h2>Role: {highlightText(job.title, searchQuery)}</h2>
                                <p><strong>Company:</strong> {highlightText(job.company?.display_name || "Unknown", searchQuery)}</p>
                                <p><strong>Location:</strong> {highlightText(job.location?.display_name || "Unknown", searchQuery)}</p>

                                <button
                                    onClick={() => toggleSaveJob(job)}
                                    className={`save-job-btn ${isJobSaved(job.id) ? "saved" : "unsaved"}`}
                                >
                                    {isJobSaved(job.id) ? "❤️" : "🤍"}
                                </button>

                                <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                                    Apply Now
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No jobs available.</p>
                )}
            </div>
        </div>
    );
};

export default UNavbar;
