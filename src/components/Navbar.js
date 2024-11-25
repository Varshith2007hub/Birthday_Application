import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import Login from "./Login";
import AdminPage from "./AdminPage";
import "./Navbar.css";
import "./FormStyles.css";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import ModalDialog from "./ModalDialog";
import moment from "moment/moment";

const MyNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [kidBirthday, setKidBirthday] = useState("");
  // const [hostedAtShelter, setHostedAtShelter] = useState("");
  const [kidGender, setKidGender] = useState("");
  const [birthdayOption, setBirthdayOption] = useState("");
  const [step2Data, setStep2Data] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); // Track admin login status
  const [shelters, setShelters] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Fetch shelters from the API when the component mounts
    const fetchShelters = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/shelters");
        setShelters(response.data);
      } catch (error) {
        console.error("Error fetching shelters:", error);
      }
    };

    fetchShelters();
  }, []);
  // Function to check if Step 1 is completely filled
  const isStep1Filled = () => {
    return (
      fullName &&
      shelterName &&
      email &&
      contactNumber &&
      kidBirthday &&
      kidGender &&
      birthdayOption
    );
  };
  // const formatDateToMMDDYY = (dateString) => {
  //   const dateObject = new Date(dateString);
  //   const mm = String(dateObject.getMonth() + 1).padStart(2, "0");
  //   const dd = String(dateObject.getDate()).padStart(2, "0");
  //   const yy = String(dateObject.getFullYear());
  //   return `${mm}-${dd}-${yy}`;
  // };

  // Function to check if email is in a valid format
  const isEmailValid = () => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to check if contact number is in a valid format
  const isContactNumberValid = () => {
    // Regular expression for phone number validation (10 digits, optional dashes)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(contactNumber);
  };

  const handleStepNext = () => {
    // if (step === 1 && !isStep1Filled()) {
    //   setModalTitle("Incomplete Fields");
    //   setModalMessage("Please fill all fields in Step 1 before proceeding.");
    //   setShowAlertModal(true);
    // } else if (step === 1 && !isEmailValid()) {
    //   setModalTitle("Invalid Email");
    //   setModalMessage("Please enter a valid email address.");
    //   setShowAlertModal(true);
    // } else if (step === 1 && !isContactNumberValid()) {
    //   setModalTitle("Invalid Contact Number");
    //   setModalMessage("Please enter a valid 10-digit contact number.");
    //   setShowAlertModal(true);
    // } else {
    //   setStep(step + 1);
    // }

    if (step === 1) {
      const isStep1Valid = validateStep1(); // Validate Step 1
      if (isStep1Valid) {
        setStep(step + 1); // Proceed to next step
      }
    } else {
      setStep(step + 1);
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!fullName) {
      errors.fullName = "Full Name is required";
    }
    if (!shelterName) {
      errors.shelterName = "Shelter Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!isEmailValid()) {
      errors.email = "Invalid email format";
    }
    if (!contactNumber) {
      errors.contactNumber = "Contact Number is required";
    } else if (!isContactNumberValid()) {
      errors.contactNumber = "Invalid contact number format";
    }
    if (!kidBirthday) {
      errors.kidBirthday = "Kid Birthday is required";
    }
    if (!kidGender) {
      errors.kidGender = "Kid Gender is required";
    }
    if (!birthdayOption) {
      errors.birthdayOption = "Birthday Option is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!hostedAtShelter.value) {
      errors.hostedAtShelter = "Hosted at Shelter is required";
    }
    if (hostedAtShelter.value == "No" && !hostedAtField.value) {
      errors.hostedAtField = "hosted At Field required";
    }
    if (preferredDateTime.value) {
      errors.hostedAtShelter = "preferred Date Time is required";
    }
    if (!preferredFoodChoice.value) {
      errors.hostedAtShelter = "preferred Food Choice is required";
    }
    if (!partyGoersAttend.value) {
      errors.hostedAtShelter = "party Goers Attend is required";
    }
    if (!preferredTheme.value) {
      errors.hostedAtShelter = "preferred Theme is required";
    }
    if (!preferredFoodChoice.value) {
      errors.hostedAtShelter = "preferred Food Choice is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    shelterName: "",
    email: "",
    contactNumber: "",
    kidBirthday: "",
    kidGender: "",
    birthdayOption: "",
    hostedAtShelter: "",
    hostedAtField: "",
    preferredDateTime: "",
    preferredFoodChoice: "",
    partyGoersAttend: "",
    preferredTheme: "",
    preferredFoodChoice: "",
  });

  const handleAlertCloseModal = () => {
    setShowAlertModal(false);
  };

  const handleStepPrevious = () => {
    setStep(step - 1);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleShelterNameChange = (e) => {
    setShelterName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleKidBirthdayChange = (e) => {
    // const inputDate = e.target.value;
    // const formattedDate = formatDateToMMDDYY(inputDate);
    // setKidBirthday(formattedDate);
    // console.log(typeof inputDate, typeof formattedDate);
    setKidBirthday(e.target.value);
  };

  const handleKidGenderChange = (e) => {
    setKidGender(e.target.value);
  };

  const handleBirthdayOptionChange = (e) => {
    setBirthdayOption(e.target.value);
  };

  const handleStep2DataChange = (e) => {
    setStep2Data({ ...step2Data, [e.target.name]: e.target.value });
    console.log(step2Data, e.target.value);
  };

  const handleSubmit = async () => {
    const v = validateStep2();
    if (v === true) {
      try {
        const response = await fetch("http://localhost:3000/submit-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            shelterName,
            email,
            contactNumber,
            kidBirthday,
            kidGender,
            birthdayOption,
            ...step2Data,
          }),
        });

        if (response.ok) {
          // Form submission successful
          alert("Form submitted successfully");
          handleModalClose();
        } else {
          // Form submission failed
          alert("Form submission failed. Please try again later.");
        }
      } catch (error) {
        alert("Error submitting form. Please try again later.");
      }
    }
  };

  const renderStep1 = () => {
    return (
      <Form>
        <Form.Group controlId="shelterName">
          <Form.Label className="required-field">Shelter</Form.Label>
          <Form.Control
            as="select"
            value={shelterName}
            onChange={handleShelterNameChange}
            className={formErrors.shelterName ? "error-input" : ""}
          >
            <option value="">Select a shelter</option>
            {shelters.map((shelter) => (
              <option key={shelter} value={shelter}>
                {shelter}
              </option>
            ))}

            {formErrors.fullName && (
              <div className="error">{formErrors.fullName}</div>
            )}
          </Form.Control>
          {formErrors.shelterName && (
            <div className="error">{formErrors.shelterName}</div>
          )}
        </Form.Group>

        <Form.Group controlId="fullName">
          <Form.Label className="required-field">Contact Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter manager's full name"
            value={fullName}
            onChange={handleFullNameChange}
            className={formErrors.fullName ? "error-input" : ""}
          />
          {formErrors.fullName && (
            <div className="error">{formErrors.fullName}</div>
          )}
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label className="required-field">Contact Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
            className={formErrors.email ? "error-input" : ""}
          />
          {formErrors.email && <div className="error">{formErrors.email}</div>}
        </Form.Group>

        <Form.Group controlId="contactNumber">
          <Form.Label className="required-field">
            Contact Phone Number
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={handleContactNumberChange}
            className={formErrors.contactNumber ? "error-input" : ""}
          />
          {formErrors.contactNumber && (
            <div className="error">{formErrors.contactNumber}</div>
          )}
        </Form.Group>

        <Form.Group controlId="kidBirthday">
          <Form.Label className="required-field">
            Kiddo’s Date of Birthday
          </Form.Label>
          <Form.Control
            type="date"
            value={kidBirthday}
            onChange={handleKidBirthdayChange}
            className={formErrors.kidBirthday ? "error-input" : ""}
          />
          {formErrors.kidBirthday && (
            <div className="error">{formErrors.kidBirthday}</div>
          )}
        </Form.Group>

        <Form.Group controlId="kidGender">
          <Form.Label className="required-field">Kiddo’s Gender</Form.Label>
          <Form.Control
            as="select"
            value={kidGender}
            onChange={handleKidGenderChange}
            className={formErrors.kidGender ? "error-input" : ""}
          >
            <option value="">Select kid's gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Control>
          {formErrors.kidGender && (
            <div className="error">{formErrors.kidGender}</div>
          )}
        </Form.Group>

        <Form.Group controlId="birthdayOption">
          <Form.Label className="required-field">Birthday Option</Form.Label>
          <Form.Control
            as="select"
            value={birthdayOption}
            onChange={handleBirthdayOptionChange}
            className={formErrors.birthdayOption ? "error-input" : ""}
          >
            <option value="">Select birthday option</option>
            <option value="Birthday-in-a-Box">Birthday-in-a-Box</option>
            <option value="Birthday-in-a-Class">Birthday-in-a-Class</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Birthday Surprise">Birthday Surprise</option>
            <option value="Happy Born Day">Happy Born Day</option>
          </Form.Control>
          {formErrors.birthdayOption && (
            <div className="error">{formErrors.birthdayOption}</div>
          )}
        </Form.Group>
      </Form>
    );
  };

  const renderStep2 = () => {
    if (birthdayOption === "Birthday Party") {
      return (
        <div>
          <Form.Group controlId="hostedAtShelter">
            <Form.Label className="required-field">
              Do you want the party hosted at the shelter?
            </Form.Label>
            <Form.Control
              as="select"
              name="hostedAtShelter"
              onChange={handleStep2DataChange}
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Control>
            {formErrors.hostedAtShelter && (
              <label className="error">{formErrors.hostedAtShelter}</label>
            )}
          </Form.Group>
          <Form.Group controlId="hostedAtField">
            <Form.Label>If no, what is the preferred location?</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter hosting location"
              name="hostedAtField"
              onChange={handleStep2DataChange}
            />
            {formErrors.hostedAtField && (
              <label className="error">{formErrors.hostedAtField}</label>
            )}
          </Form.Group>
          <Form.Group controlId="preferredDateTime">
            <Form.Label className="required-field">
              Preferred date and time of the party
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="preferredDateTime"
              onChange={handleStep2DataChange}
            />
            {formErrors.preferredDateTime && (
              <label className="error">{formErrors.preferredDateTime}</label>
            )}
          </Form.Group>
          <Form.Group controlId="partyGoersAttend">
            <Form.Label className="required-field">
              How many party-goers will attend the party?
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the total number of kiddos and adults"
              name="partyGoersAttend"
              onChange={handleStep2DataChange}
            />
            {formErrors.partyGoersAttend && (
              <label className="error">{formErrors.partyGoersAttend}</label>
            )}
          </Form.Group>
          <Form.Group controlId="preferredTheme">
            <Form.Label className="required-field">
              Is there a preferred theme?
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter preferred theme"
              name="preferredTheme"
              onChange={handleStep2DataChange}
            />
            {formErrors.preferredTheme && (
              <label className="error">{formErrors.preferredTheme}</label>
            )}
          </Form.Group>
          <Form.Group controlId="preferredFoodChoice">
            <Form.Label className="required-field">
              Is there a preferred food choice? If yes, please specify.
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter preferred food choice"
              name="preferredFoodChoice"
              onChange={handleStep2DataChange}
            />
            {formErrors.preferredFoodChoice && (
              <label className="error">{formErrors.preferredFoodChoice}</label>
            )}
          </Form.Group>
          <Form.Group controlId="additional_information_party">
            <Form.Label>Additional information</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add additional information"
              name="additional_information_party"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
        </div>
      );
    } else if (birthdayOption === "Birthday-in-a-Box") {
      return (
        <>
          <Form.Group controlId="giftSelection">
            <Form.Label className="required-field">
              Do you want IYBI to select the gifts for the birthday kiddo?
            </Form.Label>
            <Form.Control
              as="select"
              name="giftSelection"
              onChange={handleStep2DataChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="giftPreferences">
            <Form.Label>
              If "No" was selected, please provide more information about the
              birthday kiddo's preferences.
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Tell us more about their preferences"
              name="giftPreferences"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="additional_information">
            <Form.Label>Additional information</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add additional information"
              name="additional_information"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
        </>
      );
    } else if (birthdayOption === "Birthday Surprise") {
      return (
        <>
          <Form.Group controlId="giftLink">
            <Form.Label className="required-field">
              Gifts for Each Birthday Kiddo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Insert a clickable Amazon link separated by commas"
              name="giftLink"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="additional_information_suprise">
            <Form.Label>Additional information</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add additional information"
              name="additional_information_suprise"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="mailingAddress">
            <Form.Label className="required-field">
              If this is your first time selecting this birthday option, please
              provide the shelter's mailing address.
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter shelter's mailing address"
              name="mailingAddress"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
        </>
      );
    } else if (birthdayOption === "Happy Born Day") {
      return (
        <>
          <Form.Group controlId="giftLinks">
            <Form.Label className="required-field">
              Gift for the new mom or kiddo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Insert a clickable amazon link separated by commas"
              name="giftLinks"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="additional_information_day">
            <Form.Label>Additional information</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add additional information"
              name="additional_information_day"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="mailingAddress">
            <Form.Label className="required-field">
              If this is your first time selecting this birthday option, please
              provide the shelter's mailing address.
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter shelter's mailing address"
              name="mailingAddress"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
        </>
      );
    } else if (birthdayOption === "Birthday-in-a-Class") {
      return (
        <>
          <Form.Group controlId="school">
            <Form.Label className="required-field">
              School attended by the birthday kiddo
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter school name"
              name="school"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="contactinformation">
            <Form.Label className="required-field">
              Contact information
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name of person at the school to contact"
              name="deliveryTime"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="deliveryTime">
            <Form.Label className="required-field">
              Best delivery time
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter best delivery time"
              name="deliveryTime"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="classSize">
            <Form.Label className="required-field">
              Number of kiddos in the class
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter class size"
              name="classSize"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="characterPreference">
            <Form.Label className="required-field">
              Does the kiddo like a specific character
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name of character"
              name="characterPreference"
              onChange={handleStep2DataChange}
            />
          </Form.Group>

          <Form.Group controlId="allergies">
            <Form.Label className="required-field">Allergies</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter any allergies"
              name="allergies"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
          <Form.Group controlId="additional_information_class">
            <Form.Label>Additional information</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add additional information"
              name="giftPreferences"
              onChange={handleStep2DataChange}
            />
          </Form.Group>
        </>
      );
    } else {
      return null;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return null;
    }
  };

  const renderModalFooter = () => {
    return (
      <Modal.Footer>
        {step > 1 && (
          <Button variant="secondary" onClick={handleStepPrevious}>
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button variant="primary" onClick={handleStepNext}>
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Modal.Footer>
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
    setStep(1);
    setFullName("");
    setShelterName("");
    setEmail("");
    setContactNumber("");
    setKidBirthday("");
    setKidGender("");
    setBirthdayOption("");
    setStep2Data({});
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleAdminLogin = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      // Assuming the server returns a JWT token upon successful login
      const { token } = response.data;
      if (token) {
        // Set the JWT token as a cookie
        document.cookie = `jwt=${token}; path=/; max-age=3600`; // max-age is set to 1 hour (3600 seconds)
        setLoggedIn(true);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  if (loggedIn) {
    return (
      <div className="admin-page">
        <AdminPage />
      </div>
    );
  } else {
    return (
      <div>
        {/* Navbar */}
        <div className="d-flex">
          <nav className="bg-light w-100 ">
            <div className=" header d-flex flex-wrap justify-content-between align-items-center">
              <div className="d-flex justify-content-start align-items-center">
                <img src="./img.jpg" alt="logo" className="logo" />
              </div>
              <div className="d-flex justify-content-end mt-2 mt-md-0">
                <Login
                  style={{ margin: "5px" }}
                  className="btn btn-outline-success my-2 my-sm-0"
                  handleAdminLogin={handleAdminLogin}
                />
                <Button
                  style={{ margin: "5px" }}
                  variant="outline-dark"
                  className="btn btn-outline-success my-2 my-sm-0"
                  onClick={handleModalOpen}
                >
                  Birthday Options
                </Button>
              </div>
            </div>
          </nav>
        </div>

        {/* Image container */}
        <div className="image-container">
          <img src="/cover.JPG" alt="Cover" className="image" />
        </div>

        {/* Footer */}
        <div className="footer d-flex flex-wrap justify-content-center align-items-center">
          <div>
            <img src="image6.jpg" alt="logo" className="footer-logo" />
          </div>
          <div className="sub-footer">
            {/* Content for the first sub-div in the footer */}
            <p>It's Your Birthday Inc.</p>
            <p>PO Box 2222</p>
            <p>Florissant, MO 63032</p>
            <p>info@itsyourbirthdayinc.org</p>
            <p>Phone: (314) 623-8301</p>
          </div>
          <div className="sub-footer">
            {/* Content for the second sub-div in the footer */}
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/BirthdayMemory"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>

              <a
                href="https://www.youtube.com/channel/UCLspe475F5KOlc0DtWeKfkg/featured"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.instagram.com/memorablebirthday/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="modal-container">
          <Modal show={showModal} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Birthday Options - Step {step}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderStepContent()}</Modal.Body>
            {renderModalFooter()}
          </Modal>
        </div>
        <ModalDialog
          show={showAlertModal}
          onHide={handleAlertCloseModal}
          title={modalTitle}
          message={modalMessage}
        />
      </div>
    );
  }
};

export default MyNavbar;
