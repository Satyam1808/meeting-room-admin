import React, { useState } from "react";
import "./PendingApproval.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faEllipsisV, faList } from "@fortawesome/free-solid-svg-icons";

const PendingApproval = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ New state

  const [bookings, setBookings] = useState([
    {
      room: "Training Room B6",
      employee: "Kirti Pal Singh",
      from: "February 28, 2025 09:00 AM",
      to: "February 28, 2025 12:00 PM",
      floor: "6th Floor",
      seats: "20",
      date: "February 28, 2025",
      bookedFrom: "Internal Portal",
      status: "Pending",
      description: "Training session on cybersecurity",
      image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&auto=format&fit=crop&q=60"
    },
    {
      room: "Training Room A1",
      employee: "Satyam Kumar",
      from: "January 28, 2025 09:00 AM",
      to: "January 28, 2025 09:50 AM",
      floor: "1st Floor",
      seats: "10",
      date: "January 28, 2025",
      bookedFrom: "Internal Portal",
      status: "Pending",
      description: "Team meeting",
      image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&auto=format&fit=crop&q=60"
    }
  ]);

  const approveBooking = (index) => {
    setBookings(bookings.map((booking, i) =>
      i === index ? { ...booking, status: "Approved" } : booking
    ));
    setMenuOpen(null);
  };

  const rejectBooking = (index) => {
    setBookings(bookings.map((booking, i) =>
      i === index ? { ...booking, status: "Rejected" } : booking
    ));
    setMenuOpen(null);
  };

  // Filter bookings by status and search
  const filteredBookings = bookings
    .filter((booking) => activeTab === "All" || booking.status === activeTab)
    .filter((booking) => {
      const search = searchTerm.toLowerCase();
      return (
        booking.room.toLowerCase().includes(search) ||
        booking.employee.toLowerCase().includes(search) ||
        booking.description.toLowerCase().includes(search) ||
        booking.date.toLowerCase().includes(search) ||
        booking.status.toLowerCase().includes(search)
      );
    });

  const toggleMenu = (index) => setMenuOpen(menuOpen === index ? null : index);

  return (
    <div className="approval-container" onClick={() => setMenuOpen(null)}>
      <h1>Pending For Approval</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ Handle search input
        />
        <div className="icons">
          <FontAwesomeIcon
            icon={viewMode === "table" ? faThLarge : faList}
            onClick={() =>
              setViewMode(viewMode === "table" ? "grid" : "table")
            }
          />
        </div>
      </div>

      {viewMode === "table" ? (
        <table>
          <thead>
            <tr>
              <th>Room Booked</th>
              <th>Employee Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
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
                <td>{booking.status}</td>
                <td className="action" onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                  {menuOpen === index && (
                    <div className="dropdown-menu">
                      {booking.status === "Pending" && (
                        <>
                          <div onClick={() => approveBooking(index)}>Approve</div>
                          <div onClick={() => rejectBooking(index)}>Reject</div>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid-view">
    {filteredBookings.map((booking, index) => (
      <div key={index} className="grid-item">
        <h3>{booking.room}</h3>
        <p><strong>Employee:</strong> {booking.employee}</p>
        <p><strong>From:</strong> {booking.from}</p>
        <p><strong>To:</strong> {booking.to}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        {booking.status === "Pending" && (
          <div className="grid-actions">
            <button onClick={() => approveBooking(index)}>Approve</button>
            <button onClick={() => rejectBooking(index)}>Reject</button>
          </div>
        )}
      </div>
    ))}
  </div>
)}
           
    </div>
  );
};

export default PendingApproval;
