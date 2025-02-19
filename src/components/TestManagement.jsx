import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", password: "", confirmPassword: "", email: "", role: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [otpError, setOtpError] = useState("");
 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`http://${API_IP}:${API_PORT}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndExecute = async () => {
    try {
      setOtpError("");
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const token = localStorage.getItem("access_token");
      
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const username = userInfo.username; 

      // Verify OTP
      const verifyResponse = await axios.post(
        `http://${API_IP}:${API_PORT}/api/2fa/verify`,
        {
          username,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (verifyResponse.status === 200) {
        // Update tokens if provided in response
        if (verifyResponse.data.access_token) {
          localStorage.setItem("access_token", verifyResponse.data.access_token);
        }
        if (verifyResponse.data.refresh_token) {
          localStorage.setItem("refresh_token", verifyResponse.data.refresh_token);
        }

        // Execute the protected action
        await actionToConfirm();
        
        // Reset states
        setIsOtpModalOpen(false);
        setOtp("");
        setActionToConfirm(null);
        setOtpError("");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      if (error.response?.status === 401) {
        setOtpError("Invalid OTP code. Please try again.");
      } else if (error.response?.status === 404) {
        setOtpError("User not found. Please check your credentials.");
      } else if (error.response?.status === 400) {
        setOtpError(error.response.data.msg || "Invalid request. Please check your input.");
      } else {
        setOtpError("Verification failed. Please try again.");
      }
    }
  };

  const handleSecuredAction = (action) => {
    setActionToConfirm(() => action);
    setIsOtpModalOpen(true);
    setOtpError("");
    setOtp("");
  };

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const addUserAction = async () => {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.post(
          `http://${API_IP}:${API_PORT}/api/users`,
          {
            username: newUser.username,
            password: newUser.password,
            email: newUser.email,
            role: newUser.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          alert("User added successfully");
          fetchUsers();
          setNewUser({ username: "", password: "", confirmPassword: "", email: "", role: "" });
          setIsModalOpen(false);
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add user");
      }
    };

    handleSecuredAction(addUserAction);
  };

  const handleUpdateUser = () => {
    if (editUser.password !== editUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updateUserAction = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP;
        const API_PORT = import.meta.env.VITE_API_PORT;
        const token = localStorage.getItem("access_token");

        const response = await axios.put(
          `http://${API_IP}:${API_PORT}/api/users/${editUser.id}`,
          {
            username: editUser.username,
            email: editUser.email,
            role: editUser.role,
            password: editUser.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("User updated successfully");
          setEditUser(null);
          fetchUsers();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update user");
      }
    };

    handleSecuredAction(updateUserAction);
  };

  const handleDelete = (userId, userRole) => {
    if (userRole === "admin") {
      alert("You cannot delete another admin.");
      return;
    }

    const deleteUserAction = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP;
        const API_PORT = import.meta.env.VITE_API_PORT;
        const token = localStorage.getItem("access_token");

        const response = await axios.delete(
          `http://${API_IP}:${API_PORT}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUsers(users.filter((user) => user.id !== userId));
          alert("User deleted successfully");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete user");
      }
    };

    handleSecuredAction(deleteUserAction, "Are you sure you want to delete this user?");
  };

  return (
    <div className="user-management-container">
      <h2 className="title">User Management</h2>
      <button className="add-button" onClick={() => setIsModalOpen(true)}>Add New User/Group</button>
      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="edit2-button" onClick={() => setEditUser(user)}>Edit</button>
                    <button className="delete2-button" onClick={() => handleDelete(user.id, user.role)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editUser && (
            <div className="modal-overlay">
              <div className="modal">
                <h3 className="modal-title">Edit User</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="password"
                  placeholder="NewPassword"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="password"
                  placeholder="Confirm NewPassword"
                  value={editUser.confirmPassword}
                  onChange={(e) => setEditUser({ ...editUser, confirmPassword: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="modal-input"
                />
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="modal-input"
                >
                  <option value="">Select Role</option>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <div className="modal-actions">
                  <button className="modal-submit-button" onClick={handleUpdateUser}>Update User</button>
                  <button className="modal-cancel-button" onClick={() => setEditUser(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3 className="modal-title">Add New User</h3>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="modal-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="modal-input"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="modal-input"
                >
                  <option value="">Select Role</option>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <div className="modal-actions">
                  <button className="submit-button" onClick={handleAddUser}>Add User</button>
                  <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

{isOtpModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Security Verification</h3>
            <p className="otp-instruction">
              Please enter the 6-digit verification code from your authenticator app
            </p>
            <div className="otp-input-container">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setOtpError("");
                }}
                className="modal-input otp-input"
                maxLength={6}
                pattern="\d*"
                autoComplete="off"
              />
            </div>
            {otpError && (
              <p className="error-message">{otpError}</p>
            )}
            <div className="modal-actions">
              <button 
                className="submit-button" 
                onClick={verifyOtpAndExecute}
                disabled={otp.length !== 6}
              >
                Verify Code
              </button>
              <button 
                className="cancel-button" 
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setOtp("");
                  setOtpError("");
                  setActionToConfirm(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default UserManagement;