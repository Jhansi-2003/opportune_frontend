import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./workshops.css";
import { stylesToString } from "@mantine/core";

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [filteredWorkshops, setFilteredWorkshops] = useState([]);
    const [savedWorkshops, setSavedWorkshops] = useState(new Set()); // Store saved workshops

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ company: "", location: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

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
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get("http://localhost:5005/api/workshops");
                setWorkshops(response.data.workshops);
                setFilteredWorkshops(response.data.workshops);
            } catch (error) {
                setError("Error fetching workshops: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        let filtered = workshops;

        if (filters.company) {
            filtered = filtered.filter(workshop =>
                workshop.company.toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.location) {
            filtered = filtered.filter(workshop =>
                workshop.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        if (searchQuery) {
            filtered = filtered.filter(workshop =>
                workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workshop.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workshop.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredWorkshops(filtered);
    }, [filters, searchQuery, workshops]);


    const highlightText = (text, searchTerm) => {
        if (!text || !searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        );
    };


    // Toggle save/unsave state
    const toggleSave = (index) => {
        setSavedWorkshops((prevSaved) => {
            const newSaved = new Set(prevSaved);
            if (newSaved.has(index)) {
                newSaved.delete(index);
            } else {
                newSaved.add(index);
            }
            return newSaved;
        });
    };

    return (
        <div className="workshops-container">

            <nav className="Upper-navbar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search workshops..."
                        className="search-input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {/* <span className="search-icon">
                        <img src={"../../assets/icons/search.svg"} alt="Search" />
                    </span> */}
                </div>
                <h1>WORKSHOPS</h1>
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
                {loading && <p>Loading workshops...</p>}
                {error && <p>{error}</p>}

                {!loading && filteredWorkshops.length === 0 ? (
                    <p>No workshops available.</p>
                ) : (
                    <div className="workshops-grid">
                        {filteredWorkshops.map((workshop, index) => (
                            <div key={index} className="workshop-card">
                                <h2>{highlightText(workshop.title, searchQuery)}</h2>
                                <p><strong>Company:</strong> {highlightText(workshop.company, searchQuery)}</p>
                                <p><strong>Location:</strong> {highlightText(workshop.location, searchQuery)}</p>
                                <a href={workshop.url} target="_blank" rel="noopener noreferrer">View Details</a>
                                <button
                                    className={`save-btn ${savedWorkshops.has(index) ? "saved" : ""}`}
                                    onClick={() => toggleSave(index)}
                                >
                                    {savedWorkshops.has(index) ? "⭐" : "☆"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>

    );
};

export default Workshops;
