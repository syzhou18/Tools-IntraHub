CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft',
    priority INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    attachment_url TEXT,
    target_role VARCHAR(50),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
