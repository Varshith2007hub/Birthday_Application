import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

function getCookieValue(cookieName) {
  const cookieValue = document.cookie.match(
    `(^|;)\\s*${cookieName}\\s*=\\s*([^;]+)`
  );
  return cookieValue ? cookieValue.pop() : "";
}

// Assuming the token is stored in the "jwt" cookie
const token = getCookieValue("jwt");
const DeleteShelterModal = ({ show, onClose, shelter, onShelterDeleted }) => {
  const handleDeleteShelter = async () => {
    try {
      // Make the API call to delete the shelter
      await axios.delete(`http://localhost:3000/api/shelters/${shelter}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // Handle the response if needed (e.g., show a success message)
      console.log("Shelter deleted successfully:", shelter);

      // Notify the parent component that the shelter has been deleted
      onShelterDeleted(shelter);

      // Close the modal after successful deletion
      onClose();
    } catch (error) {
      console.error("Error deleting shelter:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Shelter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the shelter "{shelter}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          No
        </Button>
        <Button variant="danger" onClick={handleDeleteShelter}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteShelterModal;
