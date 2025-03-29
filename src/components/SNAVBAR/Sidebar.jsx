import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SideNavBar = () => {
    const [isExpanded, setExpendState] = useState(false);
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const menuItems = [
        { text: "Home", icon: "/assets/icons/home.svg", path: "/home" },
        { text: "Workshops", icon: "/assets/icons/workshop.svg", path: "/workshops" },
        { text: "Internships", icon: "/assets/icons/internship.svg", path: "/internship" },
        { text: "Jobs", icon: "/assets/icons/job.svg", path: "/jobs" },
        { text: "Notifications", icon: "/assets/icons/notification.svg", path: "/notifications" },
        { text: "Contact us", icon: "/assets/icons/contactus.svg", path: "/contactus" },
        { text: "Profile", icon: "/assets/icons/profile_new.svg", path: "/profile" },
        { text: "Logout", icon: "/assets/icons/logout.svg", path: "/" }, // Special handling below
    ];

    // Close dropdown and sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setExpendState(false);
                setAccountMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            // Optionally clear session/localStorage here
            navigate("/"); // Redirect to login page
        }
    };

    return (
        <div
            ref={sidebarRef}
            className={`sidebar ${isExpanded ? "side-nav-container" : "side-nav-container side-nav-container-NX"}`}
        >
            <div className="nav-upper">
                <div className="nav-heading">
                    {isExpanded && (
                        <div className="nav-brand">
                            <img src="/assets/images/logo.png" alt="LOGO" />
                        </div>
                    )}
                    <button
                        className={`hamburger ${isExpanded ? "hamburger-in" : "hamburger-out"}`}
                        onClick={() => setExpendState(!isExpanded)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="nav-menu">
                    {menuItems.map(({ text, icon, path }) =>
                        text === "Logout" ? (
                            <div
                                key={text}
                                className={`menu-item ${isExpanded ? "" : "menu-item-NX"}`}
                                onClick={handleLogout}
                                style={{ cursor: "pointer" }}
                            >
                                <img className="logout-menu-item-icon" src={icon} alt={`${text} icon`} />
                                {isExpanded && <p>{text}</p>}
                            </div>
                        ) : (
                            <NavLink
                                to={path}
                                key={text}
                                className={`menu-item ${isExpanded ? "" : "menu-item-NX"}`}
                                activeclassname="active"
                                onClick={() => setExpendState(false)}
                            >
                                <img className="logout-menu-item-icon" src={icon} alt={`${text} icon`} />
                                {isExpanded && <p>{text}</p>}
                            </NavLink>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideNavBar;
