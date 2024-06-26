import React from "react";
import "./styles.scss";
import { JobSucces } from "../../svg";
import Profile from "/images/Profile.png";

const Card = ({ freelancer }) => {
  return (
    <div className="card">
      <div className="cardContent">
        {/* <div className="imageWrapper">
          <img src={Profile} alt="Freelancer" className="image" />
        </div> */}
        <div className="details">
          <div className="header">
            <div className="profile">
              <img src={Profile} alt="Freelancer" className="profileImage" />
              <div>
                <div className="flex">
                  <h4 className="name">{freelancer.name}</h4>
                  <p className="locationField">
                    {freelancer.location}
                    {/* | {freelancer.field} */}
                  </p>
                </div>
                <p className="FreelancerField">{freelancer.field} </p>
                <p className="skills"></p>
              </div>
            </div>
            <button className="inviteButton">Invite a Job</button>
          </div>
          <div className="rateSuccessEarned">
            <span className="rate">${freelancer.rate}/hr</span>
            <JobSucces className="svg" />
            <span className="success">{freelancer.successRate}% Success</span>
            <span className="earned">${freelancer.amountEarned} earned</span>
          </div>
          <div className="skillTags">
            {freelancer.skills.map((skill) => (
              <span key={skill} className="skillTag">
                {skill}
              </span>
            ))}
          </div>
          <p className="description">{freelancer.description}</p>
        </div>
      </div>
    </div>
  );
};
export default Card;
