import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Loading from "./Loading";

function ClientsAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/user")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, []);

  if (loading) return <Loading />;
  if (users?.length === 0)
    return <h2 className="py-2 text-center">No users yet</h2>;

  return (
    <div style={{ height: "400px", overflowY: "auto" }}>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Client Id</th>
            <th>Client Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.Username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ClientsAdminPage;
