-- Mediterranean College Alumni Network Database Schema

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS events_attendees;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schools;

-- Create schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user', 'admin', 'pending'
    school_id INTEGER REFERENCES schools(id),
    graduation_year SMALLINT,
    degree VARCHAR(100),
    current_position VARCHAR(100),
    company VARCHAR(100),
    bio TEXT,
    linkedin_url VARCHAR(255),
    profile_image VARCHAR(255), -- URL to profile image
    is_public BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    organizer_id INTEGER REFERENCES users(id),
    school_id INTEGER REFERENCES schools(id), -- If event is specific to a school
    is_public BOOLEAN DEFAULT TRUE,
    max_attendees INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create event attendees junction table
CREATE TABLE events_attendees (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rsvp_status VARCHAR(20) NOT NULL, -- 'going', 'maybe', 'not_going'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_school ON events(school_id);

-- Insert initial schools data
INSERT INTO schools (name, description) VALUES
('School of Business', 'The School of Business offers degrees in Business Administration, Marketing, Finance, and Management.'),
('School of Computing', 'The School of Computing offers degrees in Computer Science, Software Engineering, Data Science, and Cybersecurity.'),
('School of Engineering', 'The School of Engineering offers degrees in Civil Engineering, Mechanical Engineering, Electrical Engineering, and Chemical Engineering.'),
('School of Health Sciences', 'The School of Health Sciences offers degrees in Nursing, Pharmacy, Physical Therapy, and Public Health.'),
('School of Humanities', 'The School of Humanities offers degrees in English, History, Philosophy, and Psychology.');

-- Insert admin user (password: admin123 - in a real app, this would be properly hashed)
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Admin', 'User', 'admin@medcollege.edu', '$2a$10$iEPa7.DccyFtx8J0MIAyZuQQnFr3.sQdUVdW6Z5xJvvs/q9X9iRKq', 'admin');
