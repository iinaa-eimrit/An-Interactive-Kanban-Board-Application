import React from "react";
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile1.png";
import profile4 from "../Assets/profile4.jpeg";
import profile5 from "../Assets/profile5.jpeg";
import profile6 from "../Assets/profile6.png";
import profile7 from "../Assets/profile7.png";

const Card = ({
  id,
  title,
  tag,
  userId,
  userData,
  status,
  priority,
  grouping,
  statusMapping,
}) => {
  const user = userData.find((user) => user.id === userId);

  const renderStatusIcon = (status) => {
    const icons = {
      Todo: <i className="bx bx-circle" id="todo"></i>,
      "In progress": <i className="bx bx-adjust" id="progress"></i>,
      Backlog: <i className="bx bx-task-x" id="backlog"></i>,
      Done: <i className="bx bxs-check-circle" id="done"></i>,
    };
    return icons[status] || <i className="bx bxs-x-circle" id="cancel"></i>;
  };

  const getUserAvatar = (userId) => {
    const avatars = {
      "usr-1": profile1,
      "usr-2": profile6,
      "usr-3": profile7,
      "usr-4": profile5,
      "usr-5": profile4,
    };
    return avatars[userId] || profile;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="status-heading">
          {(grouping === "users" || grouping === "priority") && renderStatusIcon(statusMapping[id])}
          <p>{id}</p>
        </div>
        {grouping !== "users" && (
          <div className={user && !user.available ? "user-avatar-unavailable" : "user-avatar"}>
            <img
              src={getUserAvatar(userId)}
              alt="user"
              className={user && !user.available ? "user-avatar-unavailable" : "user-avatar"}
            />
          </div>
        )}
      </div>
      <div className="card-title">
        <p>{title}</p>
      </div>
      <div className="card-footer">
        {grouping !== "priority" && (
          <div className="feature-container">
            <i className={`bx ${priority === "0" ? "bx-dots-horizontal-rounded" : 
                          priority === "1" ? "bx-signal-2" : 
                          priority === "2" ? "bx-signal-3" : 
                          priority === "3" ? "bx-signal-4" : 
                          "bxs-message-square-error"}`}></i>
          </div>   
        )}
        {tag?.map((value, index) => (
          <div className="feature-container" key={index}>
            <div className="alert-icon"></div>
            <div className="feature-request">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
