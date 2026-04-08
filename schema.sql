-- Active: 1769663102149@@127.0.0.1@3306@apex_arena
-- SQL Schema for APEX ARENA

CREATE DATABASE IF NOT EXISTS apex_arena;
USE apex_arena;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    uid VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    displayName VARCHAR(255),
    photoURL TEXT,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uid VARCHAR(255) NOT NULL,
    sport_id VARCHAR(100) NOT NULL,
    sport_name VARCHAR(255) NOT NULL,
    trainer_id VARCHAR(100),
    trainer_name VARCHAR(255),
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uid) REFERENCES users(uid)
);

-- Membership Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uid VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    sport_interest VARCHAR(255) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uid) REFERENCES users(uid)
);

select * FROM users;
select * FROM bookings;
select * FROM applications;
