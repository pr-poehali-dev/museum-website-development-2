-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exhibits table
CREATE TABLE IF NOT EXISTS exhibits (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    period VARCHAR(100),
    description TEXT,
    image_url TEXT,
    category VARCHAR(100),
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create virtual_tours table
CREATE TABLE IF NOT EXISTS virtual_tours (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    video_url TEXT,
    thumbnail_url TEXT,
    viewers_count INTEGER DEFAULT 0,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_favorites table for saved exhibits
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    exhibit_id INTEGER REFERENCES exhibits(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, exhibit_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exhibits_category ON exhibits(category);
CREATE INDEX IF NOT EXISTS idx_exhibits_active ON exhibits(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_category ON virtual_tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_active ON virtual_tours(is_active);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- Insert sample data for exhibits
INSERT INTO exhibits (title, period, description, image_url, category, location) VALUES
('Античная скульптура', 'III век до н.э.', 'Мраморная статуя древнегреческого периода, представляющая собой выдающийся образец классического искусства', 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/10997e98-cb29-410d-957c-0569786a3cdb.jpg', 'Античность', 'Зал 1'),
('Золото фараонов', 'XIV век до н.э.', 'Золотая маска египетского правителя, найденная в гробнице фараона', 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/07f8b567-658f-4740-b7ce-c505eae126de.jpg', 'Древний Египет', 'Зал 2'),
('Рыцарские доспехи', 'XV век н.э.', 'Полный комплект средневековых доспехов рыцаря периода крестовых походов', 'https://cdn.poehali.dev/projects/8a771729-5b69-449c-843a-a57495ac4956/files/34847715-07f9-41ce-a7e8-d4ee2b7d8683.jpg', 'Средневековье', 'Зал 3');

-- Insert sample data for virtual tours
INSERT INTO virtual_tours (title, description, duration_minutes, category, viewers_count) VALUES
('Античный зал', 'Погрузитесь в мир древнегреческой и римской культуры. Экскурсия включает скульптуры, амфоры и древние артефакты', 25, 'Античность', 1250),
('Египетская коллекция', 'Откройте тайны древнего Египта через уникальные артефакты фараонов и пирамид', 30, 'Древний Египет', 2100),
('Средневековье', 'Путешествие в эпоху рыцарей, замков и средневековых традиций Европы', 20, 'Средневековье', 890);
