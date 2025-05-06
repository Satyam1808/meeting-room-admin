import React, { useState } from "react";
import "./History.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";

const History = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [statusFilter, setStatusFilter] = useState("All");

  const bookings = [
    {
      room: "Training Room B6",
      employee: "Kirti Pal Singh",
      from: "February 28, 2025 09:00 AM",
      to: "February 28, 2025 12:00 PM",
      status: "Completed",
      image: "/images/room-b6.jpg",
    },
    {
      room: "Training Room A1",
      employee: "Satyam Kumar",
      from: "January 28, 2025 09:00 AM",
      to: "January 28, 2025 09:50 AM",
      status: "Rejected",
      image: "/images/room-a1.jpg",
    },
    {
      room: "Training Room B5",
      employee: "Satyam Kumar",
      from: "March 20, 2025 12:40 PM",
      to: "March 20, 2025 01:40 PM",
      status: "Cancelled",
      image: "/images/room-b5.jpg",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Rejected":
        return "red";
      case "Cancelled":
        return "orange";
      default:
        return "gray";
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => statusFilter === "All" || booking.status === statusFilter
  );

  return (
    <div className="history-container">
      <h1>Booking History</h1>

      {/* Tabs and Toggle Icon Row */}
      <div className="tabs-row">
        <div className="tabs">
          {["All", "Rejected", "Completed", "Cancelled"].map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setStatusFilter(tab);
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="grid-toggle">
          <FontAwesomeIcon
            icon={viewMode === "table" ? faThLarge : faList}
            onClick={() =>
              setViewMode(viewMode === "table" ? "grid" : "table")
            }
          />
        </div>
      </div>

      {/* Table or Grid View */}
      {viewMode === "table" ? (
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Employee</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.room}</td>
                <td>{booking.employee}</td>
                <td>{booking.from}</td>
                <td>{booking.to}</td>
                <td style={{ color: getStatusColor(booking.status) }}>
                  {booking.status}
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
                alt={booking.room}
                className="room-image"
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
              <p style={{ color: getStatusColor(booking.status) }}>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
