import React, { useState, useEffect } from "react";
import "./AllBooking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { getAllBookings } from "../api";
import { useLocation } from "react-router-dom";

const AllBookings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "All");
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [bookingList, setBookingList] = useState([]);

  const capitalizeStatus = (status) => {
  if (!status) return status;
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getDisplayStatus = (booking) => {
  if (["rejected"].includes(booking.approveStatus?.toLowerCase())) {
    return booking.approveStatus || "";
  }
  return booking.status || "";
};


 const filteredBookings = bookingList.filter((booking) =>
  (activeTab === "All" || getDisplayStatus(booking) === activeTab) &&
  (
    booking.roomId?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getDisplayStatus(booking).toLowerCase().includes(searchQuery.toLowerCase())
  )
);

useEffect(() => {
  const fetchBookings = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const data = await getAllBookings(token);
      
      // Filter out bookings where approveStatus is "pending"
      const filteredData = data.filter((booking) => booking.approveStatus?.toLowerCase() !== "pending");
      
      setBookingList(filteredData);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  fetchBookings();
}, []);

 useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

const getStatusColor = (status) => {
  if (!status) return "gray";
  switch (status.toLowerCase()) {
    case "completed":
      return "green";
    case "rejected":
      return "red";
    case "ongoing":
      return "orange";
    default:
      return "gray";
  }
};

const handleView = (booking) => {
  setSelectedBooking(booking);
  setOpenDropdownIndex(null);
};
  

  const closePopup = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="allbooking-container">
      <h1>All Bookings</h1>

    <div className="tabs">
  {["All", "rejected", "completed", "ongoing"].map((tab) => (
    <div
      key={tab}
      className={`tab ${activeTab === tab ? "active" : ""}`}
      onClick={() => setActiveTab(tab)}
    >
      {capitalizeStatus(tab)} {/* Only display the capitalized version */}
    </div>
  ))}
</div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon
          icon={viewMode === "table" ? faThLarge : faList}
          onClick={() =>
            setViewMode(viewMode === "table" ? "grid" : "table")
          }
          className="icon"
        />
      </div>

     {viewMode === "table" ? (
  <table>
    <thead>
      <tr>
        <th>Room</th>
        <th>Employee</th>
        <th>From</th>
        <th>To</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredBookings.map((booking, index) => (
        <tr key={index}>
          <td>{booking.roomId?.title}</td>
          <td>{booking.userName}</td>
          <td>{new Date(booking.fromDateTime).toLocaleString()}</td>
          <td>{new Date(booking.toDateTime).toLocaleString()}</td>
          <td style={{ color: getStatusColor(getDisplayStatus(booking)) }}>
            {getDisplayStatus(booking)}
          </td>
          <td>
            <div className="dropdown-wrapper">
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="three-dots"
                onClick={() =>
                  setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                }
              />
              {openDropdownIndex === index && (
                <div className="dropdown-menu">
                  <div onClick={() => handleView(booking)}>View</div>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <div className="grid-view">
    {filteredBookings.map((booking, index) => (
      <div key={index} className="grid-item-1">
        <img
          src={booking.roomId?.image}
          alt={booking.roomId?.title}
          className="booking-image"
        />
        <h3>{booking.roomId?.title}</h3>
        <p><strong>Employee:</strong> {booking.userName}</p>
        <p><strong>From:</strong> {new Date(booking.fromDateTime).toLocaleString()}</p>
        <p><strong>To:</strong> {new Date(booking.toDateTime).toLocaleString()}</p>
        <p style={{ color: getStatusColor(getDisplayStatus(booking)) }}>
          <strong>Status:</strong> {getDisplayStatus(booking)}
        </p>
        <div className="grid-buttons">
          <button onClick={() => handleView(booking)}>View</button>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Popup Modal */}
    {selectedBooking && (
  <div className="popup">
    <div className="popup-content">
      <span className="close-btn" onClick={closePopup}>&times;</span>
      <img
        src={selectedBooking.roomId?.image}
        alt={selectedBooking.roomId?.title}
        className="popup-image"
      />
      <h2>{selectedBooking.roomId?.title}</h2>
      <p><strong>Floor:</strong> {selectedBooking.roomId?.floor}</p>
      <p><strong>Seats:</strong> {selectedBooking.roomId?.seats}</p>
      <p><strong>From:</strong> {new Date(selectedBooking.fromDateTime).toLocaleString()}</p>
      <p><strong>To:</strong> {new Date(selectedBooking.toDateTime).toLocaleString()}</p>
      <p><strong>Booked By:</strong> {selectedBooking.userName}</p>
      <p><strong>Status:</strong> {getDisplayStatus(selectedBooking)}</p>
      <p><strong>Description:</strong> {selectedBooking.roomId?.description}</p>
    </div>
  </div>
)}
    </div>
  );
};

export default AllBookings;

