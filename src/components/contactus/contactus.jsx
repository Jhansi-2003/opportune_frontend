import React, { useState } from "react";
import "./contactus.css";
import emailjs from '@emailjs/browser';

export default function Contactus() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        message: "",
    });

    const [notification, setNotification] = useState(""); // For submission message
    const [errors, setErrors] = useState({}); // For validation errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear specific field error when user starts typing
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors = {};

        // Name should not be empty
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Phone number should be at least 10 digits
        if (formData.phoneNumber.length < 10 || isNaN(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be at least 10 digits and numeric.";
        }

        // Message should not be empty
        if (!formData.message.trim()) {
            newErrors.message = "Message is required.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        emailjs.sendForm('service_q2rtezm', 'template_pamkftr', e.target, 'R3PyfT5MifU4wWorr')
            .then((response) => {
                console.log("SUCCESS!", response.status, response.text);
                setNotification("Form submitted successfully!");
                setFormData({ fullName: "", email: "", phoneNumber: "", message: "" }); // Clear the form
                setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
            }, (error) => {
                console.error("FAILED...", error);
                setNotification("Failed to submit the form. Please try again.");
                setTimeout(() => setNotification(""), 3000);
            });
    };

    return (
        <div className="contactus-page">
            <h1>Reach Out to Us</h1>
            <div className="contact">
                <div className="image">
                    <img
                        src="../../assets/images/contactus.png"
                        alt="contactus"
                        className="contact-img"
                    />
                </div>
                <div className="contactform">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="fullName">FULL NAME:</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <p className="error-message" style={{ color: "red" }}>{errors.fullName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">EMAIL:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="error-message" style={{ color: "red" }}>{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">PHONE NUMBER:</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                            {errors.phoneNumber && (
                                <p className="error-message" style={{ color: "red" }}>{errors.phoneNumber}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">MESSAGE:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Enter your message"
                            ></textarea>
                            {errors.message && <p className="error-message" style={{ color: "red" }}>{errors.message}</p>}
                        </div>
                        <button type="submit" className="submit-button">SUBMIT</button>
                    </form>
                    {notification && (
                        <p style={{ color: "green", marginTop: "10px" }}>{notification}</p>
                    )}
                </div>
            </div>
        </div>
    );
};