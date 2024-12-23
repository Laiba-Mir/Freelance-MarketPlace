import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  UserReview,
  CommonButton,
  Header,
  Spinner,
} from "../../components/index";
import {
  Australia,
  UStates,
  SArabia,
  Chat,
  Star,
  JobSucces,
} from "../../svg/index";
import { Navigate } from "react-router-dom";

function ProfileView() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");

  const [reviews, setReviews] = useState(null);

  const fetchFreelancerReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const freelancerId = decodedToken.userId;

      console.log("Token:", token);

      console.log("freelancerid", freelancerId);
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/freelancer/${freelancerId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response review", response.data.data);
      setReviews(response.data.data);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerReviews();
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const [response, userResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/freelancer/profile/${userId}`, {
            headers,
          }),
          axios.get(`http://localhost:5000/api/client/users`, { headers }),
        ]);

        setProfileData(response.data.data);
        const userInfo = userResponse.data.find((user) => user._id === userId);
        setCountry(userInfo ? userInfo.country_name : "Not specified");

        setLoading(false);
        // console.log('profile:', profileData.image)
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to fetch profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
    setCountry(localStorage.getItem("country") || "Not specified");
  }, []);

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>No profile data found</div>;

  //   console.log('Profile data:', profileData);

  // console.log('Profile image path:', `http://localhost:5000${profileData.image}`);
  // console.log('Profile data:', profileData.image);
  // console.log('Portfolio path:', `http://localhost:5000/api/freelancer/profile/portfolios/${profileData.attachment}`);

  // const userReviews = [
  //   {
  //     id: 1,
  //     name: "Usman Shahid",
  //     location: "Australia",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
  //     rating: 3,
  //     locationIcon: <Australia />,
  //   },
  //   {
  //     id: 2,
  //     name: "Aqib Ali",
  //     location: "United States",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
  //     rating: 5,
  //     locationIcon: <UStates />,
  //   },
  //   {
  //     id: 3,
  //     name: "Shehroz Mubarik",
  //     location: "Saudi Arabia",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
  //     rating: 4,
  //     locationIcon: <SArabia />,
  //   },
  //   // Add more user reviews as needed
  // ];
  return (
    <div>
      <Header />
      <div className="m-20 p-8">
        <div className="Upper-part">
          <div className="Container">
            <div className="flex items-center mb-16 pl-8">
              <img
                src={profileData.image} // Image URL from Cloudinary
                alt={profileData.name}
                className="w-18 h-20 rounded-full aspect-square"
              />

              <div className="flex flex-col ml-6">
                <div className="font-Poppins text-[#4BCBEB] text-[32px] name">
                  {profileData.name}
                </div>
                <div className="flex items-center">
                  <div className="text-[#2C3E50] text-[20px] font-Poppins mb-5 location">
                    {country}
                  </div>
                </div>

                <div className="flex">
                  <div className="flex items-center">
                    <JobSucces className="h-3 w-3" />
                    <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                      {profileData.jobSuccess}% Job Success
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3" />
                    <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                      {profileData.rate}$/hr
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between buttons ml-[50%] pr-5">
                <CommonButton
                  onClick={handleClick}
                  text={<Chat />}
                  className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex items-center justify-between buttons">
                <CommonButton
                  onClick={() => navigate(`/myprofile`)}
                  text="Edit"
                  className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          <hr className="border-line" />

          <div className="flex flex-container">
            <div className="LeftSide w-1/3 border-r border-[#94A3B8] rounded-md p-4 mb-4 mr-4">
              <h2 className="text-[24px] font-Poppins text-[#2C3E50] mb-4 font-medium">
                View Profile
              </h2>

              <h2 className="font-Poppins text-[20px] text-[#2C3E50] mb-6 font-medium">
                Skills:
              </h2>
              <div className="flex flex-wrap mb-6">
                {profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-[#2C3E50] text-[20px] font-Poppins font-medium mb-6">
                  Experience:
                </h2>
                <div className="mb-2 flex flex-row  text-center">
                  <div className="mr-6 flex flex-col">
                    <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      {profileData.totalJobs}
                    </span>
                    <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      years
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {/* <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      {profileData.totalHours}
                    </span> */}
                    {/* <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      Total Hours
                    </span> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="RightSide Outer">
              <div className="top">
                <h2 className="ProfileTitle">{profileData.experience.title}</h2>
                <div>
                  <p className="Profiledescription">
                    {profileData.experience.description}
                  </p>
                </div>
              </div>

              <div className="PortfolioSection">
                <h2 className="Portfoliotitle">Portfolio</h2>
                <div className="grid grid-cols-3 gap-4 ml-4">
                  {profileData.portfolios.map((portfolio, index) => (
                    <div key={index} className="border rounded p-4">
                      {portfolio.attachment &&
                        (portfolio.attachment.toLowerCase().endsWith(".pdf") ? (
                          <div className="w-full h-40 flex items-center justify-center bg-gray-200 mb-2">
                            <a
                              href={portfolio.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View PDF
                            </a>
                          </div>
                        ) : (
                          <img
                            src={portfolio.attachment}
                            alt={
                              portfolio.project_title ||
                              `Portfolio item ${index + 1}`
                            }
                            className="w-full h-40 object-cover mb-2"
                          />
                        ))}
                      <h3 className="font-Poppins text-[16px] text-[#2C3E50]">
                        {portfolio.project_title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              <div className="review">
                <h2 className="reviewtitle">Reviews</h2>
                {loading ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : error ? (
                  <div className="text-red-500 py-4">{error}</div>
                ) : (
                  <>
                    {reviews && reviews.total_reviews > 0 ? (
                      <>
                        {/* Existing reviews mapping */}
                        {reviews.reviews.map((review) => (
                           <UserReview
                           key={review.review_id}
                           // Use the client's full name from the response
                           name={`${review.client.first_name} ${review.client.last_name}`}
                           // Use the client's country from the response
                           location={review.client.country || "Unknown"}
                           description={review.review_message}
                           rating={review.rating}
                           // Add profile picture from the client data
                           profileImage={review.client.profile_picture} // Pass the profile picture
                           locationIcon={
                             review.client.country === "Australia" ? (
                               <Australia />
                             ) : review.client.country === "United States" ? (
                               <UStates />
                             ) : review.client.country === "Saudi Arabia" ? (
                               <SArabia />
                             ) : (
                               <UStates />
                             )
                           }
                           date={new Date(review.posted_date).toLocaleDateString()}
                           jobTitle={review.job.title || "Untitled Job"}
                         />
                        ))}

                        <div className="review-summary mb-6 bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-2">
                                <h2 className="reviewtitle">Average Ratings</h2>
                                <span className="text-3xl font-bold text-[#2C3E50]">
                                  {reviews.average_rating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-gray-600 text-sm">
                                {reviews.total_reviews}{" "}
                                {reviews.total_reviews === 1
                                  ? "review"
                                  : "reviews"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <p className="text-sm">No reviews yet</p>
                        <p className="text-xs mt-1">
                          This freelancer hasn't received any reviews yet
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
