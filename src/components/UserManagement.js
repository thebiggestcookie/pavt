import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', lastLogin: '2023-05-01 10:30:00' },
    { id: 2, username: 'user1', lastLogin: '2023-05-02 14:45:00' },
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });

  const addUser = () => {
    if (newUser.username && newUser.password) {
      setUsers([...users, { id: users.length + 1, username: newUser.username, lastLogin: 'Never' }]);
      setNewUser({ username: '', password: '' });
    }
  };

  const removeUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const resetPassword = (id) => {
    // In a real application, this would trigger a password reset email or generate a temporary password
    alert(`Password reset for user with ID ${id}`);
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
          onClick={addUser}
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
                    onClick={() => resetPassword(user.id)}
                    className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => removeUser(user.id)}
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

