import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

function getCookieValue(cookieName) {
  const cookieValue = document.cookie.match(
    `(^|;)\\s*${cookieName}\\s*=\\s*([^;]+)`
  );
  return cookieValue ? cookieValue.pop() : "";
}

// Assuming the token is stored in the "jwt" cookie
const token = getCookieValue("jwt");
const AddShelterModal = ({ show, onClose }) => {
  const [shelterName, setShelterName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleShelterNameChange = (e) => {
    setShelterName(e.target.value);
    setIsError(false); // Clear validation error when the user starts typing
  };

  const handleSubmit = async () => {
    try {
      if (shelterName.trim() === "") {
        setIsError(true);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/shelters",
        { shelterName }, // Request body goes here
        {
          headers: {
            Authorization: `${token}`, // Headers go here
          },
        }
      );

      console.log("Shelter added successfully:", response.data);

      setIsSubmitted(true);
      setShelterName("");
      onClose(shelterName);
    } catch (error) {
      console.error("Error adding shelter:", error);
      setIsError(true);
    }
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    setIsError(false);
    setShelterName("");
    onClose();
  };

  return (
    <>
      {/* Add Shelter Modal */}
      <Modal show={show} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Shelter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="shelterName">
              <Form.Label>Shelter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shelter name"
                value={shelterName}
                onChange={handleShelterNameChange}
                isInvalid={isError} // Show validation feedback
              />
              {isError && (
                <Form.Control.Feedback type="invalid">
                  Shelter name cannot be empty.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={isSubmitted} onHide={handleModalClose} centered>
        <Modal.Header>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Shelter added successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddShelterModal;
