import React from "react";
import "./styles.scss";
import { CommonButton } from "../../components/index";
import { Chat } from "../../svg/index";
import { useNavigate } from "react-router-dom";

const ProposalCard = ({
  ProposalID,
  name,
  title,
  location,
  rate,
  earned,
  timeline,
  coverLetter,
  image,
  jobTitle,
  status
}) => {

  
  console.log('Job name:', title); // Log to check the id value
  const navigate = useNavigate();

  const handleHireClick = (e) => {
    e.stopPropagation(); // Prevent any other click events
   
  };






  // Function to fetch freelancer details by proposal ID (from backend)
  async function getFreelancerDetails(ProposalID) {

    const token = localStorage.getItem('token');  // Assuming you store the JWT token in localStorage
  
    try {
      const response = await fetch(`http://localhost:5000/api/client/proposal/${ProposalID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add your token for authentication
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const freelancerDetails = await response.json();
      console.log('Freelancer details:', freelancerDetails);
  
      return freelancerDetails;
    } catch (error) {
      console.error('Failed to fetch freelancer details:', error);
      return null;
    }
  }

  // Function to handle the chat button click
  const handleChatClick = async (ProposalID) => {
    console.log('Proposal ID:', ProposalID); // Add this line
    const freelancerDetails = await getFreelancerDetails(ProposalID);
  
    if (freelancerDetails) {
      localStorage.setItem("proposalId", ProposalID);
      localStorage.setItem("freelancerDetails", JSON.stringify(freelancerDetails));
      navigate("/chat");  // Now using navigate here is valid
    } else {
      console.error("Failed to fetch freelancer details");
    }
  };
  

  // const handleChatClick = () => {
  //   localStorage.setItem("proposalId", id); // Store the proposal ID in localStorage
  //   navigate("/chat");
  // };
  

  return (
    <div className="proposal-card">
      <img src={image} alt={`${name}'s profile`} className="proposal-card__image" />
      <div className="proposal-card__content">
        <div className="proposal-card__header">
          <span className="proposal-card__name">{name}</span>
          <span className="proposal-card__status">{status}</span>
        </div>
        <p className="proposal-card__title">{title}</p>
        <p className="proposal-card__location">{location}</p>
        <div className="proposal-card__details">
          <span className="proposal-card__rate">{rate}</span>
          <span className="proposal-card__earned">{earned}</span>
        </div>
        <div className="proposal-card__extra">
          {/* <span className="proposal-card__qualification-head">Qualification: </span> */}
          {/* <span className="proposal-card__qualification">{qualification}</span> */}
          <span className="proposal-card__timeline-head">Estimated timeline:</span>
          <span className="proposal-card__timeline">{timeline}</span>
        </div>
        <div>
          <span className="proposal-card__job-title-head">Job Title: </span>
          <span className="proposal-card__job-title">{jobTitle}</span>
        </div>
        <div>
          <span className="proposal-card__cover-letter-head">Cover Letter</span>
          <p className="proposal-card__cover-letter">{coverLetter}</p>
        </div>
        <div className="proposal-card__actions">
          <CommonButton
            text={<Chat />}
            className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
            onClick={() => handleChatClick(ProposalID)} // Add click handler
         />
        <CommonButton
            text="Hire"
            className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
            onClick={handleHireClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;