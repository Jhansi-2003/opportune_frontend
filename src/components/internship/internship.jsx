// (Same import statements)
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./internship.css";

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [savedInternships, setSavedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ company: "", location: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchInternships();
        loadSavedInternships();
    }, []);

    const handleClickOutside = (event) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setShowFilters(false);
        }
    };

    const fetchInternships = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/internships");

            if (Array.isArray(response.data)) {
                setInternships(response.data);
                setFilteredInternships(response.data);
            } else if (response.data?.internships && Array.isArray(response.data.internships)) {
                setInternships(response.data.internships);
                setFilteredInternships(response.data.internships);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            setError("Error fetching internships: " + error.message);
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedInternships = () => {
        const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
        setSavedInternships(saved);
    };

    const toggleSaveInternship = (internship) => {
        let updatedSaved = [...savedInternships];
        const index = updatedSaved.findIndex((item) => item.id === internship.id);

        if (index > -1) {
            updatedSaved.splice(index, 1);
        } else {
            updatedSaved.push(internship);
        }

        setSavedInternships(updatedSaved);
        localStorage.setItem("savedInternships", JSON.stringify(updatedSaved));
    };

    const isSaved = (internshipId) => savedInternships.some((item) => item.id === internshipId);

    useEffect(() => {
        let filtered = internships;
        if (filters.company) {
            filtered = filtered.filter(internship =>
                internship.company?.toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.location) {
            filtered = filtered.filter(internship =>
                internship.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        if (searchQuery) {
            filtered = filtered.filter(internship =>
                internship.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                internship.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                internship.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredInternships(filtered);
    }, [filters, searchQuery, internships]);

    const highlightText = (text, query) => {
        if (!text) return "";
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    };

    return (
        <div className="internship-container">
            <nav className="Upper-navbar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search internships..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="internship-heading">
                        <h1>INTERNSHIPS</h1>
                    </div>
                </div>

                <div className="filter-container" ref={filterRef}>
                    <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
                        <img src={"../../assets/icons/filter.svg"} alt="Filter" className="filter-icon" />
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
                                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                                />
                            </label>
                            <label>
                                Location:
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </nav>

            <div className="mainpage">
                <div className="internship-grid">
                    {loading ? (
                        <p>Loading internships...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : filteredInternships.length > 0 ? (
                        filteredInternships.map((internship, index) => (
                            <div key={index} className="internship-card">
                                <span
                                    className={`heart-icon ${isSaved(internship.id) ? "saved" : "unsaved"}`}
                                    onClick={() => toggleSaveInternship(internship)}
                                >
                                    {isSaved(internship.id) ? "❤️" : "🤍"}
                                </span>
                                <h2 dangerouslySetInnerHTML={{ __html: highlightText(internship.title, searchQuery) }} />
                                <p><strong>Company:</strong> <span dangerouslySetInnerHTML={{ __html: highlightText(internship.company, searchQuery) }} /></p>
                                <p><strong>Location:</strong> <span dangerouslySetInnerHTML={{ __html: highlightText(internship.location, searchQuery) }} /></p>
                                <button>
                                    <a href={internship.link} target="_blank" rel="noopener noreferrer">
                                        Apply Now
                                    </a>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No internships available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InternshipList;
