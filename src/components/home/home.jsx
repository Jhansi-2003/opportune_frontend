import React, { useState, useEffect } from "react";
import "./home.css";

const videos = [
  "../../assets/videos/slide-1.mp4",
  "../../assets/videos/slide-2.mp4",
  "../../assets/videos/slide-3.mp4",
  "../../assets/videos/slide-4.mp4",
  "../../assets/videos/slide-5.mp4",
  "../../assets/videos/slide-.mp4",
];

const VideoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === videos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="homepage">
    <h1 className="opportune-title">OPPORTUNE</h1>
        <h2 className="tag-line">- USE OPPORTUNE, TO FIND YOUR FORTUNE</h2>

      
      <div className="slider-container">
        <div
          className="slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {videos.map((video, index) => (
            <div className="slide" key={index}>
              <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          ))}
        </div>
        <button className="prev" onClick={goToPrevious}>
          &#10094;
        </button>
        <button className="next" onClick={goToNext}>
          &#10095;
        </button>
        <div className="dots">
          {videos.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      <Body />
      <Footer />
    </div>
  );
};

const Body = () => {
  return (
    <div className="body">
      <div className="about-us">
        <h1> Welcome to OPPORTUNE </h1>
        <h4>– where opportunity meets fortune.</h4>
        <h2>
          We are dedicated to making career growth simpler and more accessible.
          OOPORTUNE is a one-stop platform for finding jobs, internships, and
          skill-building workshops. Designed for students, job seekers, and
          professionals, our portal connects you with opportunities tailored to
          your goals.
        </h2>
      </div>
      <div className="steps">
        <h1>The Opportune Path: Find, Enroll, Master</h1>
        <div className="cards">
          <div id="card-1">
            <h3>1. Discover opportunities that align with your goals.</h3>
            <h5>
              Search and explore a variety of job openings, internships, and
              skill-building workshops curated to match your interests,
              experience, and aspirations. Our intuitive filters help you
              quickly find opportunities that fit you best.
            </h5>
          </div>
          <div id="card-2">
            <h3>2. Take the next step with confidence</h3>
            <h5>
              Seamlessly apply to jobs, sign up for workshops, or enroll in
              internships through our streamlined process. Our platform is
              designed to make enrollment easy, so you can focus on taking the
              first step toward growth.
            </h5>
          </div>
          <div id="card-3">
            <h3>3. Build skills and grow professionally.</h3>
            <h5>
              Whether it’s through hands-on internships, expert-led workshops,
              or exciting job roles, gain real-world experience and master the
              skills you need to achieve your career goals. OOPORTUNE helps you
              turn learning into success.
            </h5>
          </div>
        </div>
      </div>
      <div className="quote">
        <h1>
          Empowering futures, one opportunity at a time.
          <br />
          OPPORTUNE is where ambition meets growth.
        </h1>
      </div>
      <div className="video-container">
        <video
          src="../../assets/videos/aboutus.mp4" // Replace with your video path
          className="video"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="highlights">
        <h1>Here’s How Opportune Helps You Succeed</h1>
        <div className="advantages">
          <div id="point-1">
            <h3>Find everything in one place.</h3>
            <h4>
              Our platform connects you with job opportunities, internships, and
              workshops from various industries and educational institutions.
              Say goodbye to scattered job searches and hello to a streamlined
              experience tailored to your goals.
            </h4>
          </div>
          <div id="point-2">
            <h3>Learn and grow with ease.</h3>
            <h4>
              Access workshops, webinars, and training sessions hosted by
              colleges and organizations to boost your skills and stay
              industry-ready. Take charge of your career development with
              opportunities designed to help you thrive.
            </h4>
          </div>
          <div id="point-3">
            <h3>Personalized support at your fingertips.</h3>
            <h4>
              Navigate your career journey effortlessly with our integrated
              machine-learning-powered chatbot. From answering questions to
              offering career guidance, our chatbot is here to make your
              experience engaging and supportive.
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      <p>&copy; {currentYear} OPPORTUNE. All Rights Reserved.</p>
    </div>
  );
};

export default VideoSlider;                                                                                                                                      