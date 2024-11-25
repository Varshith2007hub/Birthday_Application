import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AddShelterModal from "./AddShelterModal";
import DeleteShelterModal from "./DeleteShelterModal";
import "./AdminPage.css";
import * as XLSX from "xlsx";

function getCookieValue(cookieName) {
  const cookieValue = document.cookie.match(
    `(^|;)\\s*${cookieName}\\s*=\\s*([^;]+)`
  );
  return cookieValue ? cookieValue.pop() : "";
}

// Assuming the token is stored in the "jwt" cookie
const token = getCookieValue("jwt");
const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [showAddShelterModal, setShowAddShelterModal] = useState(false);
  const [showDeleteShelterModal, setShowDeleteShelterModal] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/records", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching form submissions:", error);
      }
    };

    const fetchShelters = async () => {
      try {
        // Fetch the updated list of shelters after adding the new shelter
        const response = await axios.get("http://localhost:3000/api/shelters", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };

    fetchSubmissions();
    fetchShelters();
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  const handleAddShelterClick = () => {
    setShowAddShelterModal(true);
  };
  const handleDownloadExcel = () => {
    // Check if recordsData is an array
    // if (!Array.isArray(recordsData)) {
    //   console.error("recordsData is not an array");
    //   return;
    // }

    // Create a copy of the recordsData with modified IDs
    const modifiedRecordsData = submissions.map((record, index) => ({
      ...record,
      id: index + 1, // Replace the id with a unique index
    }));

    const worksheet = XLSX.utils.json_to_sheet(modifiedRecordsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

    const blob = new Blob(
      [s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "records.xlsx";
    link.click();
  };

  // Utility function to convert s to an ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const handleAddShelterModalClose = async (newShelterName) => {
    setShowAddShelterModal(false);

    if (newShelterName) {
      try {
        // Fetch the updated list of shelters after adding the new shelter
        const response = await axios.get("http://localhost:3000/api/shelters", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    }
  };

  const handleDeleteShelterClick = (shelter) => {
    setSelectedShelter(shelter);
    setShowDeleteShelterModal(true);
  };

  const handleDeleteShelterModalClose = () => {
    setShowDeleteShelterModal(false);
    setSelectedShelter(null);
  };

  const handleShelterDeleted = (deletedShelterName) => {
    // Update the list of shelters after deletion
    setShelters(shelters.filter((shelter) => shelter !== deletedShelterName));
  };

  const renderFormSubmissions = () => {
    const cdtOptions = {
      timeZone: "America/Chicago",
      timeZoneName: "short",
    };
    const sortedSubmissions = [...submissions].sort((a, b) => {
      const timestampA = new Date(a.created_at);
      const timestampB = new Date(b.created_at);
      return timestampA - timestampB;
    });
    const reversedSubmissions = sortedSubmissions.reverse();

    return reversedSubmissions.map((submission) => (
      <Card key={submission.id} className="mb-3">
        <Card.Header className="card-header">
          <h5>Kiddo Birthday Details</h5>
        </Card.Header>
        <Card.Body>
          {Object.entries(submission).map(([key, value]) => {
            if (key === "created_at") {
              // Parse PostgreSQL timestamp format: 'YYYY-MM-DD HH:MM:SS'
              const postgresTimestamp = value.replace(" ", "T"); // Replace space with 'T' for ISO 8601 compatibility
              const timestamp = new Date(postgresTimestamp);

              // Options for formatting the date in CDT
              const cdtOptions = {
                timeZone: "America/Chicago",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              };
              const cdtTime = timestamp.toLocaleString("en-US", cdtOptions);

              return (
                <div key={key}>
                  <strong>{key}: </strong>
                  {cdtTime}
                </div>
              );
            } else if (key === "gift_links" && value !== null) {
              // Render clickable gift links
              const giftLinks = value.split(",").map((link) => link.trim());
              return (
                <div key={key}>
                  <strong>{key}: </strong>
                  {giftLinks
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])}
                </div>
              );
            } else if (key === "preferred_date_time") {
              // Convert ISO 8601 timestamp to JavaScript Date object
              const preferredTimestamp = new Date(value);
              // Format the timestamp to MM-DD-YYYY HH:mm
              const formattedPreferredDateTime =
                preferredTimestamp.toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

              return (
                <div key={key}>
                  <strong>{key}: </strong>
                  {formattedPreferredDateTime}
                </div>
              );
            } else if (key !== "id") {
              const formattedValue =
                key === "kid_birthday"
                  ? new Date(value).toLocaleDateString("en-US")
                  : value;
              return (
                <div key={key}>
                  <strong>{key}: </strong>
                  {formattedValue}
                </div>
              );
            }
            return null;
          })}
        </Card.Body>
      </Card>
    ));
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="header d-flex justify-content-between align-items-center mb-4">
          <h2>Welcome, Admin!</h2>
          <div>
            {/* Add Shelter button */}
            <Button variant="success" onClick={handleDownloadExcel}>
              Download Records (Excel)
            </Button>
            <Button variant="primary" onClick={handleAddShelterClick}>
              Add Shelter
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-12">
            {/* List of Shelters */}
            <h3>Shelters</h3>
            <ul>
              {shelters.map((shelter, index) => (
                <li key={index}>
                  {shelter}{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteShelterClick(shelter)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-9 col-md-12">
            {/* Form Submissions */}
            <h3>Form Submissions</h3>
            {renderFormSubmissions()}
          </div>
        </div>

        {/* Overlay modal for adding a new shelter */}
        <AddShelterModal
          show={showAddShelterModal}
          onClose={handleAddShelterModalClose}
        />

        {/* Overlay modal for deleting a shelter */}
        <DeleteShelterModal
          show={showDeleteShelterModal}
          onClose={handleDeleteShelterModalClose}
          shelter={selectedShelter}
          onShelterDeleted={handleShelterDeleted}
        />
      </div>
    </div>
  );
};

export default AdminPage;
