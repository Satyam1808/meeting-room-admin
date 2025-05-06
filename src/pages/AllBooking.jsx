import React, { useState } from "react";
import "./AllBooking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const AllBookings = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const [bookingList, setBookingList] = useState([
    {
      room: "Training Room B6",
      employee: "Kirti Pal Singh",
      from: "February 28, 2025 09:00 AM",
      to: "February 28, 2025 12:00 PM",
      status: "Rejected",
      image: "/room-b6.jpg",
      floor: "2nd",
      seats: "20",
      date: "February 28, 2025",
      bookedFrom: "Kirti Pal Singh",
      description: "Training on security procedures.",
      title: "Room B6 Booking",
    },
    {
      room: "Training Room A1",
      employee: "Satyam Kumar",
      from: "January 28, 2025 09:00 AM",
      to: "January 28, 2025 09:50 AM",
      status: "Completed",
      image: "/room-a1.jpg",
      floor: "1st",
      seats: "15",
      date: "January 28, 2025",
      bookedFrom: "Satyam Kumar",
      description: "Quick team meeting.",
      title: "Room A1 Meeting",
    },
    {
      room: "Training Room B5",
      employee: "Satyam Kumar",
      from: "March 20, 2025 12:40 PM",
      to: "March 20, 2025 01:40 PM",
      status: "Canceled",
      image: "/room-b5.jpg",
      floor: "3rd",
      seats: "25",
      date: "March 20, 2025",
      bookedFrom: "Satyam Kumar",
      description: "Room booking cancelled by user.",
      title: "Room B5 Booking",
    },
  ]);

  const filteredBookings = bookingList.filter(
    (booking) =>
      (activeTab === "All" || booking.status === activeTab) &&
      (booking.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setOpenDropdownIndex(null); // Close dropdown if any
  };

  const handleDelete = (index) => {
    const updatedBookings = [...bookingList];
    updatedBookings.splice(index, 1);
    setBookingList(updatedBookings);
    setOpenDropdownIndex(null);
  };

  const closePopup = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="allbooking-container">
      <h1>All Bookings</h1>

      <div className="tabs">
        {["All", "Rejected", "Completed", "Canceled"].map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
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
              <th>Room Booked</th>
              <th>Employee Name</th>
              <th>From</th>
              <th>To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.room}</td>
                <td>{booking.employee}</td>
                <td>{booking.from}</td>
                <td>{booking.to}</td>
                <td className="action-cell">
                  <div className="dropdown-wrapper">
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className="three-dots"
                      onClick={() =>
                        setOpenDropdownIndex(
                          openDropdownIndex === index ? null : index
                        )
                      }
                    />
                    {openDropdownIndex === index && (
                      <div className="dropdown-menu">
                        <div onClick={() => handleView(booking)}>View</div>
                        <div onClick={() => handleDelete(index)}>Delete</div>
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
            <div key={index} className="grid-item">
              <img
                src={booking.image}
                alt={booking.title}
                className="booking-image"
              />
              <h3>{booking.room}</h3>
              <p>
                <strong>Employee:</strong> {booking.employee}
              </p>
              <p>
                <strong>From:</strong> {booking.from}
              </p>
              <p>
                <strong>To:</strong> {booking.to}
              </p>
              <div className="grid-buttons">
                <button onClick={() => handleView(booking)}>View</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedBooking && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>
              &times;
            </span>
            <img
              src={selectedBooking.image}
              alt={selectedBooking.title}
              className="popup-image"
            />
            <h2>{selectedBooking.title}</h2>
            <p>
              <strong>Floor:</strong> {selectedBooking.floor}
            </p>
            <p>
              <strong>Seats:</strong> {selectedBooking.seats}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.date}
            </p>
            <p>
              <strong>Booked By:</strong> {selectedBooking.bookedFrom}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Description:</strong> {selectedBooking.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
