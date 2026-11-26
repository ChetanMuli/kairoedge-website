-- ============================================================================
-- KAIROEDGE TECHNOLOGIES - DISTRICT-WISE CAMPUS COLLEGES SEED SCRIPT (MAHARASHTRA)
-- Run this in MySQL: sudo mysql kairoedge < seed_colleges_districtwise.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS colleges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) NULL,
  district VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ensure district column exists
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'colleges' AND COLUMN_NAME = 'district');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE colleges ADD COLUMN district VARCHAR(100) NULL AFTER code', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Clean duplicates first
DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id AND LOWER(TRIM(c1.name)) = LOWER(TRIM(c2.name));

DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id AND c1.code IS NOT NULL AND c1.code != '' AND LOWER(TRIM(c1.code)) = LOWER(TRIM(c2.code));

-- Seed / Upsert District-Wise Colleges
INSERT INTO colleges (name, code, district, city, state, is_active, sort_order) VALUES
  -- 1. PUNE DISTRICT
  ('COEP Technological University', 'COEP', 'Pune', 'Pune', 'Maharashtra', 1, 1),
  ('Pune Institute of Computer Technology (PICT)', 'PICT', 'Pune', 'Pune', 'Maharashtra', 1, 2),
  ('Vishwakarma Institute of Technology (VIT)', 'VIT', 'Pune', 'Pune', 'Maharashtra', 1, 3),
  ('MIT World Peace University (MIT-WPU)', 'MIT-WPU', 'Pune', 'Pune', 'Maharashtra', 1, 4),
  ('Pimpri Chinchwad College of Engineering (PCCOE)', 'PCCOE', 'Pune', 'Pune', 'Maharashtra', 1, 5),
  ('Cummins College of Engineering for Women', 'CCOEW', 'Pune', 'Pune', 'Maharashtra', 1, 6),
  ('Bharati Vidyapeeth Deemed University College of Engineering', 'BVDU-COE', 'Pune', 'Pune', 'Maharashtra', 1, 7),
  ('Army Institute of Technology (AIT)', 'AIT', 'Pune', 'Pune', 'Maharashtra', 1, 8),
  ('D. Y. Patil College of Engineering, Akurdi', 'DYPCOE', 'Pune', 'Pune', 'Maharashtra', 1, 9),
  ('Vishwakarma Institute of Information Technology (VIIT)', 'VIIT', 'Pune', 'Pune', 'Maharashtra', 1, 10),
  ('Sinhgad College of Engineering, Vadgaon', 'SCOE', 'Pune', 'Pune', 'Maharashtra', 1, 11),
  ('Modern Education Society''s College of Engineering', 'MESCOE', 'Pune', 'Pune', 'Maharashtra', 1, 12),
  ('JSPM Rajarshi Shahu College of Engineering', 'RSCOE', 'Pune', 'Pune', 'Maharashtra', 1, 13),
  ('Indira College of Engineering and Management', 'ICEM', 'Pune', 'Pune', 'Maharashtra', 1, 14),
  ('AISSMS College of Engineering', 'AISSMS-COE', 'Pune', 'Pune', 'Maharashtra', 1, 15),
  ('Symbiosis Institute of Technology (SIT)', 'SIT', 'Pune', 'Pune', 'Maharashtra', 1, 16),

  -- 2. AHILYANAGAR (AHMEDNAGAR) DISTRICT
  ('Amrutvahini College of Engineering, Sangamner', 'AVCOE', 'Ahilyanagar', 'Sangamner', 'Maharashtra', 1, 20),
  ('Sanjivani College of Engineering, Kopargaon', 'SCOE-KPG', 'Ahilyanagar', 'Kopargaon', 'Maharashtra', 1, 21),
  ('Pravara Rural Engineering College, Loni', 'PREC-LONI', 'Ahilyanagar', 'Loni', 'Maharashtra', 1, 22),
  ('Dr. Vithalrao Vikhe Patil College of Engineering', 'DVVP-COE', 'Ahilyanagar', 'Ahilyanagar', 'Maharashtra', 1, 23),
  ('Government Polytechnic, Ahilyanagar', 'GP-ANR', 'Ahilyanagar', 'Ahilyanagar', 'Maharashtra', 1, 24),
  ('Ahmednagar College (BPHE Society)', 'ACA', 'Ahilyanagar', 'Ahilyanagar', 'Maharashtra', 1, 25),
  ('New Arts, Commerce & Science College', 'NACSC', 'Ahilyanagar', 'Ahilyanagar', 'Maharashtra', 1, 26),
  ('Hon. Shri. Babanrao Pachpute Vichardhara Trust Faculty of Engineering', 'HSBPVT', 'Ahilyanagar', 'Kashti', 'Maharashtra', 1, 27),

  -- 3. CHHATRAPATI SAMBHAJINAGAR (AURANGABAD) DISTRICT
  ('Government College of Engineering, Chhatrapati Sambhajinagar', 'GECA', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 1, 30),
  ('Jawaharlal Nehru Engineering College (JNEC - MGM University)', 'JNEC', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 1, 31),
  ('Maharashtra Institute of Technology (MIT Aurangabad)', 'MIT-CSN', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 1, 32),
  ('Deogiri Institute of Engineering and Management Studies', 'DIEMS', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 1, 33),
  ('PES College of Engineering', 'PES-COE', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'Maharashtra', 1, 34),

  -- 4. NASHIK DISTRICT
  ('K. K. Wagh Institute of Engineering Education & Research', 'KKWIEER', 'Nashik', 'Nashik', 'Maharashtra', 1, 40),
  ('Sandip University / Sandip Foundation', 'SANDIP', 'Nashik', 'Nashik', 'Maharashtra', 1, 41),
  ('MET Bhujbal Knowledge City', 'MET-BKC', 'Nashik', 'Nashik', 'Maharashtra', 1, 42),
  ('Matoshri College of Engineering & Research Centre', 'MCOERC', 'Nashik', 'Nashik', 'Maharashtra', 1, 43),
  ('MVP Samaj''s K.B.T. College of Engineering', 'KBTCOE', 'Nashik', 'Nashik', 'Maharashtra', 1, 44),
  ('Guru Gobind Singh College of Engineering and Research Centre', 'GCOERC', 'Nashik', 'Nashik', 'Maharashtra', 1, 45),

  -- 5. MUMBAI & NAVI MUMBAI DISTRICT
  ('Veermata Jijabai Technological Institute (VJTI)', 'VJTI', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 50),
  ('Sardar Patel Institute of Technology (SPIT)', 'SPIT', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 51),
  ('D. J. Sanghvi College of Engineering', 'DJSCE', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 52),
  ('Thadomal Shahani Engineering College (TSEC)', 'TSEC', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 53),
  ('Fr. Conceicao Rodrigues College of Engineering', 'CRCE', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 54),
  ('K. J. Somaiya College of Engineering', 'KJSCE', 'Mumbai', 'Mumbai', 'Maharashtra', 1, 55),
  ('SIES Graduate School of Technology', 'SIES-GST', 'Mumbai', 'Navi Mumbai', 'Maharashtra', 1, 56),
  ('Pillai College of Engineering', 'PCE', 'Mumbai', 'Navi Mumbai', 'Maharashtra', 1, 57),
  ('Ramrao Adik Institute of Technology (RAIT)', 'RAIT', 'Mumbai', 'Navi Mumbai', 'Maharashtra', 1, 58),

  -- 6. THANE DISTRICT
  ('Vidyavardhini''s College of Engineering & Technology', 'VCET', 'Thane', 'Vasai', 'Maharashtra', 1, 60),
  ('A. P. Shah Institute of Technology', 'APSIT', 'Thane', 'Thane', 'Maharashtra', 1, 61),
  ('K. C. College of Engineering & Management Studies', 'KC-COE', 'Thane', 'Thane', 'Maharashtra', 1, 62),

  -- 7. KOLHAPUR & SANGLI DISTRICT
  ('Walchand College of Engineering, Sangli', 'WCE', 'Sangli', 'Sangli', 'Maharashtra', 1, 70),
  ('DKTE Society''s Textile and Engineering Institute', 'DKTE', 'Kolhapur', 'Ichalkaranji', 'Maharashtra', 1, 71),
  ('Kolhapur Institute of Technology''s College of Engineering (KIT)', 'KIT', 'Kolhapur', 'Kolhapur', 'Maharashtra', 1, 72),
  ('D. Y. Patil College of Engineering and Technology', 'DYPCET', 'Kolhapur', 'Kolhapur', 'Maharashtra', 1, 73),

  -- 8. SOLAPUR DISTRICT
  ('Walchand Institute of Technology (WIT Solapur)', 'WIT', 'Solapur', 'Solapur', 'Maharashtra', 1, 80),
  ('N. B. Navale Sinhgad College of Engineering', 'NBNSCOE', 'Solapur', 'Solapur', 'Maharashtra', 1, 81),

  -- 9. NAGPUR DISTRICT
  ('Visvesvaraya National Institute of Technology (VNIT)', 'VNIT', 'Nagpur', 'Nagpur', 'Maharashtra', 1, 90),
  ('Shri Ramdeobaba College of Engineering and Management (RCOEM)', 'RCOEM', 'Nagpur', 'Nagpur', 'Maharashtra', 1, 91),
  ('G. H. Raisoni College of Engineering', 'GHRECO', 'Nagpur', 'Nagpur', 'Maharashtra', 1, 92)
ON DUPLICATE KEY UPDATE
  district = VALUES(district),
  city = VALUES(city),
  state = VALUES(state),
  is_active = VALUES(is_active);

-- Final deduplication cleanup
DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id AND LOWER(TRIM(c1.name)) = LOWER(TRIM(c2.name));

DELETE c1 FROM colleges c1
INNER JOIN colleges c2 
WHERE c1.id > c2.id AND c1.code IS NOT NULL AND c1.code != '' AND LOWER(TRIM(c1.code)) = LOWER(TRIM(c2.code));

UPDATE colleges SET district = city WHERE (district IS NULL OR district = '') AND city IS NOT NULL;
