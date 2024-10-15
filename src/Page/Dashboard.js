import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import CustomSpinner from "../Components/helper";

// Import Images

import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile1.png";
import profile4 from "../Assets/profile4.jpeg";
import profile5 from "../Assets/profile5.jpeg";
import profile6 from "../Assets/profile6.png";
import profile7 from "../Assets/profile7.png";
import { FETCH_URL } from "../FETCH_URL";

const Dashboard = () => {
  // State Variables
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [priority, setPriority] = useState({});
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [availableUser, setAvailableUser] = useState({});
  const [statusMapping, setStatusMapping] = useState({});
  const statusKeys = ["Backlog", "Todo", "In progress", "Done", "Canceled"];
  

  // Fetch Data 
  useEffect(() => {
    getData();
  }, [grouping, ordering]);

  const sortByTitle = (tickets) => {
    return tickets.sort((a, b) => a.title.localeCompare(b.title));
  };

  // Grouping the data by Status
  const groupByStatus = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const grouped = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {});

    statusKeys.forEach((key) => {
      if (!grouped[key]) {
        grouped[key] = [];
      }
    });

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: statusKeys,
      ...grouped,
    };
  };

  // Grouping the data by Priority
  const groupByPriority = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const priorityObject = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.priority]) {
        acc[ticket.priority] = [];
      }
      acc[ticket.priority].push(ticket);
      return acc;
    }, {});

    return {
      Keys: Object.keys(priorityObject),
      ...priorityObject,
    };
  };

  // Grouping the data by users
  const groupByUser = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const grouped = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.userId]) {
        acc[ticket.userId] = [];
      }
      acc[ticket.userId].push(ticket);
      return acc;
    }, {});

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: userData.map((user) => user.id.toString()),
      ...grouped,
    };
  };

  // Available User (online/offline) 
  const availabilityMap = (users) => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.available;
      return acc;
    }, {});
  };

  // Work Status
  const extractStatusMapping = (data) => {
    const statusMapping = {};

    data.tickets.forEach((ticket) => {
      statusMapping[ticket.id] = ticket.status;
    });

    return statusMapping;
  };

  // Fetch API function
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(FETCH_URL);
      const data = await response.json();
      setIsLoading(false);
      setUserData(data.users);
      setUser(groupByUser(data.tickets));
      setStatus(groupByStatus(data.tickets));
      setPriority(groupByPriority(data.tickets));
      setAvailableUser(availabilityMap(data.users));
      setStatusMapping(extractStatusMapping(data));
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  if (grouping === "status") {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {status.Keys.map((item, index) => (
                  <div className="column" key={index}>
                    <div className="Header">
                      <div className="icon-text">
                        {item == "Todo" ? (
                          <i className="bx bx-circle" id="todo"></i>
                        ) : item == "In progress" ? (
                          <i className="bx bx-adjust" id="progress"></i>
                        ) : item == "Backlog" ? (
                          <i className="bx bx-task-x" id="backlog"></i>
                        ) : item == "Done" ? (
                          <i className="bx bxs-check-circle" id="done"></i>
                        ) : (
                          <i className="bx bxs-x-circle" id="cancel"></i>
                        )}
                        <span className="text">
                          {item == "In progress" ? "In Progress" : item}
                        </span>
                        <span>{status[item]?.length}</span>
                      </div>
                      <div className="actions">
                        <i className="bx bx-plus" id="plus"></i>
                        <i
                          className="bx bx-dots-horizontal-rounded"
                          id="dots"
                        ></i>
                      </div>
                    </div>
                    {status[item] &&
                      status[item].map((value) => {
                        return (
                          <Card
                            id={value.id}
                            title={value.title}
                            tag={value.tag}
                            userId={value.userId}
                            status={status}
                            userData={userData}
                            priority={value.priority}
                            key={value.id}
                            grouping={grouping}
                            ordering={ordering}
                            statusMapping={statusMapping}
                          />
                        );
                      })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  } else if (grouping == "users") {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {availableUser &&
                  user.Keys.map((userId, index) => {
                    const currentUserName =
                      userData.find((u) => u.id.toString() === userId)?.name ||
                      "Unknown";
                    return (
                      <div className="column" key={index}>
                        <div className="Header">
                          <div className="icon-text">
                            <div
                              className={
                                String(availableUser[userId]) == "false"
                                  ? "user-avatar-unavailable"
                                  : "user-avatar"
                              }
                            >
                              <img
                                src={
                                  userId == "usr-1"
                                    ? profile1
                                    : userId == "usr-2"
                                    ? profile6
                                    : userId == "usr-3"
                                    ? profile7
                                    : userId == "usr-4"
                                    ? profile5
                                    : userId == "usr-5"
                                    ? profile4
                                    : profile
                                }
                                className={
                                  String(availableUser[userId]) == "false"
                                    ? "user-avatar-unavailable"
                                    : "user-avatar"
                                }
                                alt="user"
                              ></img>
                            </div>
                            <span className="text">{currentUserName}</span>
                            <span>{user[userId]?.length}</span>
                          </div>
                          <div className="actions">
                            <i className="bx bx-plus" id="plus"></i>
                            <i
                              className="bx bx-dots-horizontal-rounded"
                              id="dots"
                            ></i>
                          </div>
                        </div>
                        {user[userId] &&
                          user[userId].map((ticket) => {
                            return (
                              <Card
                                id={ticket.id}
                                title={ticket.title}
                                tag={ticket.tag}
                                userId={ticket.userId}
                                userData={userData}
                                priority={ticket.priority}
                                key={ticket.id}
                                grouping={grouping}
                                ordering={ordering}
                                status={status}
                                statusMapping={statusMapping}
                              />
                            );
                          })}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {priority.Keys.sort((a, b) => a - b).map((item, index) => (
                  <div className="column" key={index}>
                    <div className="Header">
                      <div className="icon-text-priority">
                        {item == "0" ? (
                          <i
                            className="bx bx-dots-horizontal-rounded"
                            id="noPriority"
                          ></i>
                        ) : item == "1" ? (
                          <i className="bx bx-signal-2" id="low"></i>
                        ) : item == "2" ? (
                          <i className="bx bx-signal-3" id="medium"></i>
                        ) : item == "3" ? (
                          <i className="bx bx-signal-4" id="high"></i>
                        ) : (
                          <i
                            className="bx bxs-message-square-error"
                            id="urgent"
                          ></i>
                        )}
                        <span className="text">
                          {`Priority ${item}` == "Priority 4"
                            ? "Urgent"
                            : `Priority ${item}` == "Priority 3"
                            ? "High"
                            : `Priority ${item}` == "Priority 2"
                            ? "Medium"
                            : `Priority ${item}` == "Priority 1"
                            ? "Low"
                            : "No Priority"}
                        </span>
                        <span className="count">{priority[item]?.length}</span>
                      </div>
                      <div className="actions">
                        <i className="bx bx-plus" id="plus"></i>
                        <i
                          className="bx bx-dots-horizontal-rounded"
                          id="dots"
                        ></i>
                      </div>
                    </div>
                    {priority[item] &&
                      priority[item].map((value) => {
                        return (
                          <Card
                            id={value.id}
                            title={value.title}
                            tag={value.tag}
                            userId={value.userId}
                            status={status}
                            userData={userData}
                            priority={value.priority}
                            key={value.id}
                            grouping={grouping}
                            ordering={ordering}
                            statusMapping={statusMapping}
                          />
                        );
                      })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default Dashboard;
