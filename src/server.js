const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

const JWT_SECRET_KEY = "your-secret-key"; // Replace this with your own secret key

// JWT functions
function generateJwtToken(payload) {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" }); // Token expires in 1 hour
}

function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return null; // Return null for invalid tokens
  }
}

function authenticateJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided." });
  }

  const decodedToken = verifyJwtToken(token);

  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized: Invalid token." });
  }

  // If the token is valid, you can store the user information in the request object for future use in the routes.
  req.user = decodedToken;

  next();
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Perform login authentication here (e.g., validate username and password)
    const userQuery =
      "SELECT * FROM users WHERE username = $1 AND password = $2";
    const userResult = await pool.query(userQuery, [username, password]);

    if (userResult.rowCount === 1) {
      // Assuming the login is successful
      const userPayload = { username }; // You can customize the payload as needed
      const token = generateJwtToken(userPayload);

      const bearerToken = `Bearer ${token}`;

      res.json({ token: bearerToken });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.sendStatus(500);
  }
});

app.use((req, res, next) => {
  if (req.path === "/submit-form") {
    next();
  } else if (req.path.startsWith("/api/shelters") && req.method === "GET") {
    next();
  } else {
    authenticateJwtToken(req, res, next);
  }
});

app.post("/submit-form", async (req, res) => {
  const {
    fullName,
    shelterName,
    email,
    contactNumber,
    kidBirthday,
    kidGender,
    birthdayOption,
    ...step2Data
  } = req.body;

  try {
    let tableName;
    let columns;
    let values;

    switch (birthdayOption) {
      case "Birthday Party":
        tableName = "birthday_party_table";
        columns = [
          "full_name",
          "shelter_name",
          "email",
          "contact_number",
          "kid_birthday",
          "kid_gender",
          "Birthday_Option",
          "hosted_at_shelter",
          "hosted_at_field",
          "preferred_date_time",
          "party_goers_attend",
          "preferred_theme",
          "preferred_food_choice",
          "additional_information",
        ];
        values = [
          fullName,
          shelterName,
          email,
          contactNumber,
          kidBirthday,
          kidGender,
          birthdayOption,
          step2Data.hostedAtShelter,
          step2Data.hostedAtField,
          step2Data.preferredDateTime,
          step2Data.partyGoersAttend,
          step2Data.preferredTheme,
          step2Data.preferredFoodChoice,
          step2Data.additional_information_party,
        ];
        break;
      case "Birthday-in-a-Box":
        tableName = "birthday_in_a_box_table";
        columns = [
          "full_name",
          "shelter_name",
          "email",
          "contact_number",
          "kid_birthday",
          "kid_gender",
          "Birthday_Option",
          "gift_selection",
          "gift_preferences",
          "additional_information",
        ];
        values = [
          fullName,
          shelterName,
          email,
          contactNumber,
          kidBirthday,
          kidGender,
          birthdayOption,
          step2Data.giftSelection,
          step2Data.giftPreferences,
          step2Data.additional_information,
        ];
        break;
      case "Birthday Surprise":
        tableName = "birthday_surprise_table";
        columns = [
          "full_name",
          "shelter_name",
          "email",
          "contact_number",
          "kid_birthday",
          "kid_gender",
          "Birthday_Option",
          "gift_links",
          "additional_information",
          "mailing_address",
        ];
        values = [
          fullName,
          shelterName,
          email,
          contactNumber,
          kidBirthday,
          kidGender,
          birthdayOption,
          step2Data.giftLink,
          step2Data.additional_information_suprise,
          step2Data.mailingAddress,
        ];
        break;
      case "Happy Born Day":
        tableName = "happy_born_day_table";
        columns = [
          "full_name",
          "shelter_name",
          "email",
          "contact_number",
          "kid_birthday",
          "kid_gender",
          "Birthday_Option",
          "gift_links",
          "additional_information",
          "mailing_address",
        ];
        values = [
          fullName,
          shelterName,
          email,
          contactNumber,
          kidBirthday,
          kidGender,
          birthdayOption,
          step2Data.giftLinks,
          step2Data.additional_information_day,
          step2Data.mailingAddress,
        ];
        break;
      case "Birthday-in-a-Class":
        tableName = "birthday_in_a_class_table";
        columns = [
          "full_name",
          "shelter_name",
          "email",
          "contact_number",
          "kid_birthday",
          "kid_gender",
          "Birthday_Option",
          "school",
          "contactinformation",
          "delivery_time",
          "class_size",
          "character_preference",
          "allergies",
          "additional_information",
        ];
        values = [
          fullName,
          shelterName,
          email,
          contactNumber,
          kidBirthday,
          kidGender,
          birthdayOption,
          step2Data.school,
          step2Data.contactinformation,
          step2Data.deliveryTime,
          step2Data.classSize,
          step2Data.characterPreference,
          step2Data.allergies,
          step2Data.additional_information_class,
        ];
        break;
      default:
        return res.status(400).json({ error: "Invalid birthday option" });
    }
    await pool.query(
      `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values
        .map((_, i) => `$${i + 1}`)
        .join(", ")})`,
      values
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    res.sendStatus(500);
  }
});

app.get("/api/records", async (req, res) => {
  try {
    // Fetch records from each table
    const birthdayPartiesQuery = "SELECT * FROM birthday_party_table";
    const birthdayInABoxQuery = "SELECT * FROM birthday_in_a_box_table";
    const birthdaySurpriseQuery = "SELECT * FROM birthday_surprise_table";
    const happyBornDayQuery = "SELECT * FROM happy_born_day_table";
    const birthdayInAClassQuery = "SELECT * FROM birthday_in_a_class_table";

    const birthdayPartiesResult = await pool.query(birthdayPartiesQuery);
    const birthdayInABoxResult = await pool.query(birthdayInABoxQuery);
    const birthdaySurpriseResult = await pool.query(birthdaySurpriseQuery);
    const happyBornDayResult = await pool.query(happyBornDayQuery);
    const birthdayInAClassResult = await pool.query(birthdayInAClassQuery);

    // Combine the results into a single array
    const allRecords = [
      ...birthdayPartiesResult.rows,
      ...birthdayInABoxResult.rows,
      ...birthdaySurpriseResult.rows,
      ...happyBornDayResult.rows,
      ...birthdayInAClassResult.rows,
    ];

    res.json(allRecords);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: "An error occurred while fetching records" });
  }
});

app.post("/api/shelters", async (req, res) => {
  const { shelterName } = req.body;

  if (!shelterName) {
    return res.status(400).json({ error: "Shelter name is required." });
  }

  try {
    const insertQuery = `INSERT INTO shelters ("shelter_name") VALUES ($1)`;
    await pool.query(insertQuery, [shelterName]);
    res.json({ success: true, message: "Shelter added successfully." });
  } catch (error) {
    console.error("Error adding shelter:", error);
    res
      .status(500)
      .json({ error: "Error adding shelter. Please try again later." });
  }
});

app.get("/api/shelters", async (req, res) => {
  try {
    const shelters = await pool.query("SELECT * FROM shelters"); // Replace 'your_table_name' with the actual name of your table
    res.json(shelters.rows.map((shelter) => shelter["shelter_name"]));
  } catch (error) {
    console.error("Error fetching shelter names:", error);
    res.status(500).json({ error: "Unable to fetch shelter names." });
  }
});

app.delete("/api/shelters/:sheltername", (req, res) => {
  const shelterName = req.params.sheltername;

  if (!shelterName) {
    return res.status(400).json({ error: "Shelter name is required." });
  }

  try {
    const deleteQuery = 'DELETE FROM shelters WHERE "shelter_name" = $1';
    pool.query(deleteQuery, [shelterName]);
    res.json({ success: true, message: "Shelter deleted successfully." });
  } catch (err) {
    console.error("Error deleting shelter:", err);
    res
      .status(500)
      .json({ error: "Error deleting shelter. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
