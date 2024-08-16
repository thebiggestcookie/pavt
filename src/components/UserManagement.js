import React, { useState, useEffect } from 'react';
import { fetchUsers, addUser, removeUser, resetPassword } from '../api/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddUser = async () => {
    if (newUser.username && newUser.password) {
      try {
        const addedUser = await addUser(newUser);
        setUsers([...users, addedUser]);
        setNewUser({ username: '', password: '' });
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await removeUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await resetPassword(id);
      alert(`Password reset for user with ID ${id}`);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New User</h3>
        <input
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Username"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">User List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Last Login</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.lastLogin}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

