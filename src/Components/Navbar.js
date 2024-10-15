import React, { useState, useRef, useEffect } from "react";

const Navbar = ({ grouping: propGrouping, setGrouping, ordering: propOrdering, setOrdering, call }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initialGrouping = localStorage.getItem("grouping") || propGrouping;
  const initialOrdering = localStorage.getItem("ordering") || propOrdering;

  const [grouping, setLocalGrouping] = useState(initialGrouping);
  const [ordering, setLocalOrdering] = useState(initialOrdering);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    setGrouping(grouping);
  }, [grouping, setGrouping]);

  useEffect(() => {
    localStorage.setItem("ordering", ordering);
    setOrdering(ordering);
  }, [ordering, setOrdering]);

  // Handlers
  const handleGroupingChange = (event) => {
    const newGrouping = event.target.value;
    setLocalGrouping(newGrouping);
    if (newGrouping === "users") {
      call();
    }
  };

  const handleOrderingChange = (event) => {
    setLocalOrdering(event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Navbar">
      <div className="dropdown-container" ref={dropdownRef}>
        <button onClick={() => setIsOpen((prev) => !prev)} className="dropdown-btn">
          <i className="bx bx-slider"></i>
          <span className="btn-txt">Display Options</span>
          <i className="bx bx-chevron-down"></i>
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <div className="Grouping">
              <label htmlFor="grouping-select">Grouping</label>
              <select id="grouping-select" value={grouping} onChange={handleGroupingChange}>
                <option value="status">Status</option>
                <option value="users">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="Ordering">
              <label htmlFor="ordering-select">Ordering</label>
              <select id="ordering-select" value={ordering} onChange={handleOrderingChange}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
