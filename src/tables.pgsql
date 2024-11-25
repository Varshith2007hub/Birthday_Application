CREATE TABLE IF NOT EXISTS birthday_party_table (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  shelter_name VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(255),
  kid_birthday DATE,
  kid_gender VARCHAR(255),
  Birthday_Option VARCHAR(255),
  hosted_at_shelter VARCHAR(255),
  hosted_at_field VARCHAR(255),
  preferred_date_time TIMESTAMP,
  party_goers_attend VARCHAR(255),
  preferred_theme VARCHAR(255),
  preferred_food_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- New column for record creation date and time
);

CREATE TABLE IF NOT EXISTS birthday_in_a_box_table (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  shelter_name VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(255),
  kid_birthday DATE,
  kid_gender VARCHAR(255),
  Birthday_Option VARCHAR(255),
  gift_selection VARCHAR(255),
  gift_preferences TEXT,
  additional_information TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- New column for record creation date and time
);

CREATE TABLE IF NOT EXISTS birthday_surprise_table (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  shelter_name VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(255),
  kid_birthday DATE,
  kid_gender VARCHAR(255),
  Birthday_Option VARCHAR(255),
  gift_links TEXT,
  gift_wrap VARCHAR(255),
  mailing_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- New column for record creation date and time
);

CREATE TABLE IF NOT EXISTS happy_born_day_table (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  shelter_name VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(255),
  kid_birthday DATE,
  kid_gender VARCHAR(255),
  Birthday_Option VARCHAR(255),
  gift_links TEXT,
  gift_wrap VARCHAR(255),
  mailing_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- New column for record creation date and time
);

CREATE TABLE IF NOT EXISTS birthday_in_a_class_table (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  shelter_name VARCHAR(255),
  email VARCHAR(255),
  contact_number VARCHAR(255),
  kid_birthday DATE,
  kid_gender VARCHAR(255),
  Birthday_Option VARCHAR(255),
  school VARCHAR(255),
  delivery_time VARCHAR(255),
  class_size INTEGER,
  character_preference VARCHAR(255),
  allergies TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- New column for record creation date and time
);


CREATE TABLE shelters (
    "shelter_name" VARCHAR(255)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password) VALUES ('admin', 'password');