import React, { useState } from "react";
import { ClientFrame, FreelancerFrame } from "../../svg/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom';

const SignUpSection = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState("");

  const handleChange = (e) => {
    setSelectedUserType(e.target.value);
  };

  const handleCreateAccountButtonClick = () => {
    if (selectedUserType) {
      localStorage.setItem("userType", selectedUserType); // Save selectedUserType to local storage
      console.log(`User type stored in localStorage: ${localStorage.getItem("userType")}`); // Log to check if it's stored
      navigate('/signup'); // Replace with your target route
    } else {
      alert("Please select a user type."); // Alert if no user type is selected
    }
  };

  return (
    <div className="sign-up-section">
      <div className="main-container">
        <div className="title">
          Freelance Marketplace
          {/* <ProjectName/> */}
        </div>
        <div className="join-section">
          <h2 className="join-title">Join as a Client or Freelancer</h2>
          <div className="options-container">
            <div
              className={`option ${
                selectedUserType === "client" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="userType"
                value="client"
                id="client"
                className="radio-input"
                onChange={handleChange}
                checked={selectedUserType === "client"}
                required
              />
              <div className="option-content">
                <ClientFrame className="frame-icon" />
                <label htmlFor="client" className="option-label">
                  Client
                </label>
              </div>
              <p className="option-description">
                I’m a client, hiring
                <br />
                for a project.
              </p>
            </div>
            <div
              className={`option ${
                selectedUserType === "freelancer" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                id="freelancer"
                className="radio-input"
                onChange={handleChange}
                checked={selectedUserType === "freelancer"}
                required
              />
              <div className="option-content">
                <FreelancerFrame className="frame-icon" />
                <label htmlFor="freelancer" className="option-label">
                  Freelancer
                </label>
              </div>
              <p className="option-description">
                I’m a freelancer,
                <br />
                looking for work.
              </p>
            </div>
          </div>
        </div>
        <div className="account-section">
          <button
            className="create-account-button"
            onClick={handleCreateAccountButtonClick}
          >
            Create Account
          </button>
          <p className="login-text">
            Already have an account?{" "}
            <a href="signin" className="login-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
