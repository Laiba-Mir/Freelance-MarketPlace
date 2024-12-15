import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.scss";
import { Header, Spinner } from "../../components/index"; // Assuming these are already created.

const ClientOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOffers, setFilteredOffers] = useState([]);
  // Function to get client ID from the JWT token stored in localStorage
  const getClientIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId;
      } catch (e) {
        console.error("Invalid token format", e);
      }
    }
    return null;
  };

  // Fetching offers when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      const clientId = getClientIdFromToken();
      if (!clientId) {
        setError("Client ID not found.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const statusQueryParam = statusFilter === 'all' ? undefined : statusFilter;

        const response = await axios.get(
          `http://localhost:5000/api/client/consultantoffers/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              status: statusQueryParam
            }
          }
        );
        console.log('full response:', response.data);
        console.log('offers reci:', response.data.offers);

        // Sorting offers by created date (newest first)
        const sortedOffers = [...response.data.offers].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setOffers(sortedOffers);
        setFilteredOffers(sortedOffers);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError("Failed to fetch offers.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }


  return (
    <>
      <Header />
      <div className="client-offers-page">
      <div className="status-filter-container mb-4 flex justify-center space-x-4">
          <button 
            className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleStatusFilterChange('all')}
          >
            All Offers
          </button>
          <button 
            className={`px-4 py-2 rounded ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleStatusFilterChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded ${statusFilter === 'Accepted' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleStatusFilterChange('Accepted')}
          >
            Accepted
          </button>
          <button 
            className={`px-4 py-2 rounded ${statusFilter === 'Declined' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleStatusFilterChange('Declined')}
          >
            Declined
          </button>
        </div>

        <div className="offers-container">
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No offers found for the selected status.
            </div>
          ) : (
            offers.map((offer, index) => (
              <div className="offer-card" key={offer.id || index}>
                <div className="card-header">
                  <h3>{offer?.offerDetails?.project?.name|| "Untitled Project"}</h3>
                  <span className={`status ${offer?.status?.toLowerCase() || ""}`}>
                    {offer?.status || "Unknown"}
                  </span>
                </div>
                <div className="card-content">
                  <div className="consultant-info">
                    <h4>Consultant Information</h4>
                    <p>
                      <strong>Name:</strong> {offer?.offerDetails?.consultant?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {offer?.offerDetails?.consultant?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Skills:</strong> {offer?.offerDetails?.consultant?.skills || "N/A"}
                    </p>
                    <p>
                      <strong>Bio:</strong> {offer?.offerDetails?.consultant?.bio || "N/A"}
                    </p>
                    <p>
                      <strong>LinkedIn:</strong>{" "}
                      <a
                        href={offer?.offerDetails?.consultant?.linkedIn || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {offer?.offerDetails?.consultant?.linkedIn || "N/A"}
                      </a>
                    </p>
                  </div>
                  <div className="experience-education">
                    <div>
                      <h4>Experience</h4>
                      {offer?.offerDetails?.consultant?.experience?.length > 0 ? (
                        <ul>
                          {offer.offerDetails.consultant.experience.map((exp, index) => (
                            <li key={index}>
                              <strong>{exp.title || "N/A"}</strong> at {exp.company || "N/A"} (
                              {exp.years || "N/A"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No experience provided.</p>
                      )}
                    </div>
                    <div>
                      <h4>Education</h4>
                      {offer?.offerDetails?.consultant?.education?.length > 0 ? (
                        <ul>
                          {offer.offerDetails.consultant.education.map((edu, index) => (
                            <li key={index}>
                              <strong>{edu.degree || "N/A"}</strong> from {edu.institution || "N/A"} (
                              {edu.year || "N/A"})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No education details provided.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-description">
                  <h4>Project Details</h4>
                  <p>{offer?.offerDetails?.project?.description || "N/A"}</p>
                </div>
                {offer?.status === "Accepted" && (
                  <div className="add-project-button">
                    <button className="btn-primary">Add Project Details</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ClientOffersPage;
