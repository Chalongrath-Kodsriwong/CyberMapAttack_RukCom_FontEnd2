import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import "./css/Management.css";
import { authenticator } from "otplib";
import { FaSearch } from "react-icons/fa";

function Management() {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "Admin",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  // const [currentUserRole, setCurrentUserRole] = useState("");
  // const [currentUserId, setCurrentUserId] = useState("");
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showVerifyOTPPopup, setShowVerifyOTPPopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false); // State for displaying the Change Password popup
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // State สำหรับยืนยันรหัสผ่านใหม่
  const [newPassword, setNewPassword] = useState(""); // State to store the new password input
  const [selectedUserIdForPasswordChange, setSelectedUserIdForPasswordChange] =
    useState(null); // State to track which user's password will be changed
  const [showEditRolePopup, setShowEditRolePopup] = useState(false);
  const [selectedUserForRoleEdit, setSelectedUserForRoleEdit] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State สำหรับควบคุม PopUp OTP
  const [otp, setOtp] = useState(""); // สำหรับเก็บค่า OTP ที่กรอก
  const [otpError, setOtpError] = useState(""); // ข้อความ Error หาก OTP ไม่ถูกต้อง
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [changePasswordError, setChangePasswordError] = useState(""); // Error for Change Password
  const [searchQuery, setSearchQuery] = useState(""); // เก็บค่าการค้นหา
  const [filteredUsers, setFilteredUsers] = useState([]); // เก็บผลลัพธ์ที่ค้นหา

  const openOtpModal = (action) => {
    setActionToConfirm(() => action); // Assign the action to execute after OTP validation
    setIsOtpModalOpen(true); // Show OTP modal
    setOtp("");
    setOtpError("");
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtp("");
    setOtpError("");
  };

  const verifyOtp = async () => {
    try {
      setOtpError("");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/validate-otp`,
        {
          username: localStorage.getItem("username"),
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );

      if (response.data.error) {
        setOtpError("The OTP you entered is incorrect. Please try again.");
      } else if (response.status === 200) {
        closeOtpModal();
        if (actionToConfirm) await actionToConfirm();
        setActionToConfirm(null);
        setMessage("OTP validated successfully!");
      }
    } catch (error) {
      setOtpError("An error occurred while verifying OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  // const handleSecuredAction = (action) => {
  //   setActionToConfirm(() => action);
  //   setIsOtpModalOpen(true);
  //   setOtpError("");
  //   setOtp("");
  // };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch Pending Invitations
  const fetchTempUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/getpending_users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setTempUsers(response.data); // Update state with the latest data
    } catch (error) {
      console.error("Error fetching temp users:", error);
    }
  };

  // Add User
  const addUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      setMessage("Passwords do not match!"); // แจ้งเตือนว่ารหัสผ่านไม่ตรงกัน
      return;
    }

    const addUserAction = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/invite-user`,
          { ...newUser },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        // ดึงข้อความจาก Back-End และแสดง
        setMessage(response.data.msg);
        return response.data.msg; // คืนค่าข้อความสำหรับการใช้งานเพิ่มเติม
      } catch (error) {
        // แสดงข้อความ Error จาก Back-End
        const errorMessage = error.response?.data?.msg || "Error adding user.";
        setMessage(errorMessage);
        return errorMessage; // คืนค่าข้อความสำหรับการใช้งานเพิ่มเติม
      } finally {
        resetNewUserForm(); // รีเซ็ตฟอร์มข้อมูลใหม่
        setShowAddUserPopup(false); // ปิด PopUp Add New User เสมอ
      }
    };

    // เปิด OTP Modal และเรียกฟังก์ชันหลังจาก OTP ผ่าน
    openOtpModal(() => {
      addUserAction().then((message) => {
        // ตั้งข้อความที่ได้จาก Back-End หลังการดำเนินการเสร็จสิ้น
        setMessage(message);
      });
    });
  };

  const resetNewUserForm = () => {
    setNewUser({
      username: "",
      email: "",
      role: "Admin",
      password: "",
      confirmPassword: "",
    });
  };

  // const deleteInvite = async (userId) => {
  //   try {
  //     const response = await axios.delete(
  //       `${
  //         import.meta.env.VITE_REACT_APP_BASE_URL
  //       }/api/delete-temp-user/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  //         },
  //       }
  //     );
  //     setMessage(response.data.msg);
  //     fetchTempUsers(); // Refresh the list after deletion
  //   } catch (error) {
  //     setMessage(error.response?.data?.msg || "Error deleting invite.");
  //   }
  // };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus === "valid") {
        // รีเซ็ต 2FA และเปลี่ยนเป็น Invalid
        const response = await axios.patch(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/reset-2fa/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        setMessage(response.data.msg); // แสดงข้อความจาก Back-End
      } else {
        // เปลี่ยนเป็น Valid (อัปเดตสถานะใน Backend)
        const response = await axios.patch(
          `${
            import.meta.env.VITE_REACT_APP_BASE_URL
          }/api/toggle-status/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        setMessage(response.data.msg); // แสดงข้อความจาก Back-End
      }

      fetchTempUsers(); // อัปเดตข้อมูลผู้ใช้หลังการเปลี่ยนสถานะ
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error toggling status.");
    }
  };

  const handleCheckboxChange = (user) => {
    if (user.role === "SuperAdmin") {
      setMessage("Cannot select SuperAdmin for deletion.");
      return;
    }

    setSelectedUserIds(
      (prev) =>
        prev.includes(user.ID)
          ? prev.filter((id) => id !== user.ID) // Unselect
          : [...prev, user.ID] // Select
    );
  };

  const deleteSelectedUsers = async () => {
    if (selectedUserIds.length === 0) {
      setMessage("No users selected for deletion.");
      return;
    }

    const deleteUsersAction = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/delete-user`,
          { user_ids: selectedUserIds },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        setMessage(response.data.msg);
        fetchUsers();
        setSelectedUserIds([]);
        return response.data.msg; // คืนค่าข้อความสำหรับการใช้งานเพิ่มเติม
      } catch (error) {
        const errorMessage = error.response?.data?.msg || "Error adding user.";
        setMessage(errorMessage);
        return errorMessage; // คืนค่าข้อความสำหรับการใช้งานเพิ่มเติม
      }
    };

    // openOtpModal(deleteUsersAction);
    openOtpModal(() => {
      deleteUsersAction().then((message) => {
        // ตั้งข้อความที่ได้จาก Back-End หลังการดำเนินการเสร็จสิ้น
        setMessage(message);
      });
    });
  };

  // Change Password for selected user
  const handleChangePassword = async () => {
    // ตรวจสอบว่ามีการป้อนข้อมูลที่จำเป็น
    if (!newPassword || !selectedUserIdForPasswordChange) {
      setChangePasswordError("Please provide a valid password."); // ใช้ changePasswordError
      setNewPassword(""); // ล้างค่ารหัสผ่านใหม่
      setConfirmNewPassword(""); // ล้างค่า Confirm Password
      return;
    }

    // ตรวจสอบว่า New Password และ Confirm Password ตรงกันหรือไม่
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("Passwords do not match!"); // ใช้ changePasswordError
      setNewPassword(""); // ล้างค่ารหัสผ่านใหม่
      setConfirmNewPassword(""); // ล้างค่า Confirm Password
      return;
    }

    const changePasswordAction = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/change-password`,
          {
            user_id: selectedUserIdForPasswordChange,
            new_password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        setMessage(response.data.msg); // แสดงข้อความสำเร็จใน message ปกติ
        setShowChangePasswordPopup(false); // ปิด Popup
        setNewPassword(""); // ล้างค่ารหัสผ่านใหม่
        setConfirmNewPassword(""); // ล้างค่า Confirm Password
      } catch (error) {
        const errorMessage =
          error.response?.data?.msg || "Error changing password.";
        setChangePasswordError(errorMessage); // ใช้ changePasswordError สำหรับ Error Message

        setNewPassword(""); // ล้างค่ารหัสผ่านใหม่
        setConfirmNewPassword(""); // ล้างค่า Confirm Password
      }
    };

    // เปิด OTP Modal และเรียกฟังก์ชันหลังจาก OTP ผ่าน
    openOtpModal(() => {
      changePasswordAction();
    });
  };

  // Function to handle role editing
  const handleEditRole = async () => {
    if (!newRole || !selectedUserForRoleEdit) {
      setMessage("Please select a valid role.");
      return;
    }

    const editRoleAction = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/edit-role`,
          { user_id: selectedUserForRoleEdit, new_role: newRole },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        setMessage(response.data.msg);
        setShowEditRolePopup(false);
        fetchUsers();
        return response.data.msg;
      } catch (error) {
        const errorMessage = error.response?.data?.msg || "Error adding user.";
        setMessage(error.response?.data?.msg || "Error updating role.");
        return errorMessage;
      }
    };

    // openOtpModal(editRoleAction);
    openOtpModal(() => {
      editRoleAction().then((message) => {
        // ตั้งข้อความที่ได้จาก Back-End หลังการดำเนินการเสร็จสิ้น
        setMessage(message);
      });
    });
  };

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) {
        setFilteredUsers([]); // ถ้าไม่มี query ให้เคลียร์ผลลัพธ์
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/search-users`,
        {
          params: { query: searchQuery },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      setFilteredUsers(response.data); // เก็บผลลัพธ์ที่ค้นหา
    } catch (error) {
      console.error("Error searching users:", error);
      setMessage("Error searching users.");
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/update-status`
      );
  
      // เช็คว่าข้อความปัจจุบันคือ "Status updated successfully." หรือไม่
      if (message !== "Status updated successfully.") {
        setMessage(response.data.msg); 
      }
  
      fetchUsers(); // รีเฟรชรายการผู้ใช้
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Error updating status.");
    }
  };
  

  useEffect(() => {
    fetchUsers();
    updateStatus(); // เรียกอัปเดตสถานะตอนเริ่มต้นครั้งเดียว
  
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000); // ลดความถี่เป็น 10 วินาที
  
    return () => clearInterval(interval); // เคลียร์ Interval เมื่อ Component Unmount
  }, []);
  

  // Inside the useEffect for Pending Invitations
  useEffect(() => {
    let interval;

    if (showVerifyOTPPopup) {
      // Start polling when the popup is open
      fetchTempUsers(); // Fetch immediately on open
      interval = setInterval(() => {
        fetchTempUsers(); // Fetch data periodically
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      // Clear the interval when the popup is closed
      clearInterval(interval);
    };
  }, [showVerifyOTPPopup]);

  useEffect(() => {
    if (message) {
      console.log("Message Updated:", message); // Debugging log
      const timer = setTimeout(() => {
        console.log("Clearing message...");
        setMessage(""); // ล้างข้อความหลังจาก 5 วินาที
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  

  return (
    <div className="management-container">
      <div
        className="on-top"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h1>User Management</h1>
        <div className="btn-object" style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowAddUserPopup(true)}
            className="btn-AddNewUser"
          >
            Add New User
          </button>
          <button
            onClick={() => setShowVerifyOTPPopup(true)}
            className="btn-Display_Pedding_Invite"
          >
            Check Verify OTP
          </button>
        </div>
      </div>
      <p className="management-message">{message && <span>{message}</span>}</p>
      {/* Add New User PopUp */}
      {showAddUserPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add New User</h2>
            <div className="add-user-form">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addUser(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addUser(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addUser(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addUser(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addUser(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              >
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">Super Admin</option>
              </select>
              <div style={{ display: "flex", gap: "20px", marginTop: "10px", marginLeft: "180px"}}>
                <button className="btn-inviteOfAddnewuser" onClick={addUser}>
                  Invite User
                </button>
                <button className="btn-cancelOfAddnewuser" onClick={() => setShowAddUserPopup(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="otp-popup-overlay">
          <div className="otp-popup" style={{backgroundColor: "rgb(11, 28, 56)"}}>
            <h3 style={{color: "white"}}>Verify OTP</h3>
            <p style={{color: "white"}}>Please enter your 6-digit OTP</p>
            <input
              type="text"
              className="otp-popup-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verifyOtp(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                }
              }}
              style={{borderRadius: "20px", textAlign: "center", margin: "20px 0px"}}
            />
            {otpError && (
              <p style={{ color: "red", marginTop: "10px" }}>{otpError}</p>
            )}
            <div className="otp-popup-buttons">
              <button className="btn-verify-otp" onClick={verifyOtp}>Verify</button>
              <button className="btn-cancel-otp" onClick={closeOtpModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Display Pending Invite Popup */}
      {showVerifyOTPPopup && (
        <div className="popup-overlay">
          <div className="popup pendingInvite">
            <h2>Verify OTP</h2>
            <table className="management-table">
              <thead style={{}}>
                <tr className="container-column">
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tempUsers.map((tempUser) => (
                  <tr key={tempUser.ID}>
                    {/* ใช้ tempUser.ID เป็น key */}
                    <td>{tempUser.ID}</td> {/* แสดง ID */}
                    <td>{tempUser.username}</td>
                    <td>{tempUser.email}</td>
                    <td>{tempUser.role}</td>
                    <td
                      style={{
                        color: tempUser.status === "valid" ? "green" : "red",
                      }}
                    >
                      {tempUser.status === "valid" ? "Valid" : "Invalid"}
                    </td>
                    <td>
                      {tempUser.status === "valid" ? (
                        <button
                          onClick={() =>
                            toggleStatus(tempUser.ID, tempUser.status)
                          }
                          className="btn-reset-otp"
                        >
                          Reset OTP
                        </button>
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold", marginLeft: "5px"}}>
                          Reseted OTP
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-closeOfVerifyOTP" onClick={() => setShowVerifyOTPPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Production Users */}
      <div className="management-section">
        <div
          className="Topmenu_ProductionUsers"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="wraper_left" style={{ display: "flex" }}>
            <h2>Production Users</h2>

            <div
              className="AllBtnOfProductionUser"
              style={{
                display: "flex",
                gap: "10px",
                margin: "-8px 0px 0px 10px",
              }}
            >
              {/* Show Delete User button when one or more users are selected */}
              {selectedUserIds.length > 0 && (
                <div className="delete-user-container">
                  <button onClick={deleteSelectedUsers} className="btn-delete">
                    Delete User
                  </button>
                </div>
              )}
              {/* Show Change Password button only when one user is selected */}
              {selectedUserIds.length === 1 && (
                <button
                  className="btn-change-password"
                  onClick={() => {
                    setSelectedUserIdForPasswordChange(selectedUserIds[0]); // Set the selected user ID
                    setShowChangePasswordPopup(true); // Show the popup for password change
                  }}
                >
                  Change Password
                </button>
              )}
            </div>
          </div>

          <div className="wraper_right" style={{ marginTop: "10px" }}>
            <div
              className="search-container"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "0px 0xp 0px 0px",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Search ID or username or Email or ID And Role"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px",
                  marginRight: "5px",
                  borderRadius: "10px 20px 20px 10px",
                  width: "22rem",
                  color: "#fff",
                }}
                className="Search_input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                  }
                }}
              />
              <button onClick={handleSearch} className="btn-search">
                <FaSearch className="IconSearch" />
                <span className="btn-search-text">Search</span>
              </button>
            </div>
          </div>
        </div>
        <table className="management-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {(filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
              <tr key={user.ID}>
                <td style={{ width: "15px", textAlign: "center" }}>
                  {user.role !== "SuperAdmin" ? (
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.ID)}
                      onChange={() => handleCheckboxChange(user)}
                    />
                  ) : (
                    <span style={{ color: "red" }}>X</span>
                  )}
                </td>
                <td>{user.ID}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.role}
                  {user.role === "Admin" && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: "5px",
                      }}
                    >
                      <FaEdit
                        style={{
                          cursor: "pointer",
                          background: "transparent",
                          width: "18px",
                        }}
                        onClick={() => {
                          setSelectedUserForRoleEdit(user.ID);
                          setShowEditRolePopup(true);
                        }}
                      />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChangePasswordPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Change Password</h2>
            {/* ใช้ changePasswordError สำหรับแสดงข้อความ Error */}
            {changePasswordError && (
              <p className="management-message" style={{ color: "red" }}>
                {changePasswordError}
              </p>
            )}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangePassword(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                }
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangePassword(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                }
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button className="btn-Confirm-OfChangepassword" onClick={handleChangePassword}>
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowChangePasswordPopup(false);
                  setChangePasswordError(""); // ล้าง Error Message เมื่อ Popup ถูกปิด
                }}
                className="btn-cancel-OfChangepassword"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Popup */}
      {showEditRolePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit User Role</h2>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </select>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button className="btn-saveOfEditRole" onClick={handleEditRole}>Save</button>
              <button className="btn-cancelOfEditRole" onClick={() => setShowEditRolePopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Management;
