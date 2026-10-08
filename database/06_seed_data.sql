SET DEFINE OFF;

-- ============================================================
-- CINEGO SEED DATA — Complete October 2026 Seed Dataset
-- Primary source: cinema_movie_seed_dataset_oct_2026.csv
-- Target: Oracle 21c XE
-- ============================================================

-- ==================== LOCATIONS ====================
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (1, 'Chennai', 'Tamil Nadu', 13.0827, 80.2707);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (2, 'Puducherry', 'Puducherry', 11.9416, 79.8083);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (3, 'Bengaluru', 'Karnataka', 12.9716, 77.5946);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (4, 'Hyderabad', 'Telangana', 17.3850, 78.4867);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (5, 'Mumbai', 'Maharashtra', 19.0760, 72.8777);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (6, 'Coimbatore', 'Tamil Nadu', 11.0168, 76.9558);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (7, 'Karaikal', 'Puducherry', 10.9254, 79.8380);
INSERT INTO LOCATIONS (LOCATION_ID, CITY, STATE, LATITUDE, LONGITUDE) VALUES (8, 'Nagapattinam', 'Tamil Nadu', 10.7672, 79.8449);

-- ==================== MOVIES (36 from cinema_movie_seed_dataset_oct_2026.csv) ====================
-- Kollywood (Tamil)
INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (1, 'Baththa', 'Baththa is a gripping Tamil action drama exploring gritty street justice, raw loyalty, and redemption in the bustling coastal heartlands.', 'Tamil', 'Action, Drama', 142, TO_DATE('2026-10-01','YYYY-MM-DD'), 'UA', 4.5, 'RUNNING', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80', 'Coastal Vision', 'Vijay Sethupathi, Lijomol Jose', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (2, 'Yezhu Kadal Yezhu Malai', 'A poetic and metaphysical Tamil drama mystery recounting an undying romantic journey spanning centuries through oceans and mystic mountain peaks.', 'Tamil', 'Drama, Mystery', 150, TO_DATE('2026-10-01','YYYY-MM-DD'), 'UA', 4.6, 'RUNNING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Ram', 'Nivin Pauly, Anjali, Soori', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (3, 'Anbil Avan', 'A poignant and stirring romantic action drama portraying the lengths to which an ordinary man will go to protect the devotion of his beloved.', 'Tamil', 'Action, Drama, Romance', 145, TO_DATE('2026-10-02','YYYY-MM-DD'), 'UA', 4.3, 'RUNNING', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', 'S. Vignesh', 'Ashok Selvan, Preity Mukhundhan', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (4, 'Sigma', 'An adrenaline-surging cyber-heist and rogue agent thriller where a lone wolf strategist deconstructs an international biometric syndicate.', 'Tamil', 'Action, Thriller', 138, TO_DATE('2026-10-02','YYYY-MM-DD'), 'UA', 4.4, 'RUNNING', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', 'A. R. Murugadoss', 'Vikram Prabhu, Tanya Ravichandran', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (5, 'Kitti', 'An authentic sports drama unfolding in rural Tamil Nadu celebrating the raw passions and community rivalries of indigenous gilli-danda tournaments.', 'Tamil', 'Drama, Sport', 134, TO_DATE('2026-10-02','YYYY-MM-DD'), 'UA', 4.2, 'RUNNING', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80', 'Pa. Ranjith', 'Kathir, Kayal Anandhi', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (6, 'Bison Kaalamaadan', 'A ferocious period sports biopic set in the southern plains tracking the tempestuous rise of a lightning sprinter battling oppressive village hierarchy.', 'Tamil', 'Action, Drama, Sport', 156, TO_DATE('2026-10-08','YYYY-MM-DD'), 'UA', 4.6, 'UPCOMING', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80', 'Mari Selvaraj', 'Dhruv Vikram, Anupama Parameswaran', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (7, 'Good Bad Ugly', 'A high-octane mass masala gangster action extravaganza chronicling the clash of three ruthless power brokers over golden trade corridors.', 'Tamil', 'Action, Comedy, Crime', 160, TO_DATE('2026-10-09','YYYY-MM-DD'), 'UA', 4.7, 'UPCOMING', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', 'Adhik Ravichandran', 'Ajith Kumar, Trisha, Arjun Das', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (8, 'Demonte Colony 3', 'The terrifying third installment unearthing forgotten Portuguese cursed catacombs beneath modern Chennai as paranormal researchers get entombed.', 'Tamil', 'Horror, Mystery, Thriller', 132, TO_DATE('2026-10-15','YYYY-MM-DD'), 'UA', 4.4, 'UPCOMING', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80', 'Ajay Gnanamuthu', 'Arulnithi, Priya Bhavani Shankar', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (9, 'Kanchana 4', 'A hilarious yet spine-chilling horror comedy where a ghost-fearing man becomes the vessel for vengeance-seeking spirits in a haunted mansion.', 'Tamil', 'Comedy, Horror', 148, TO_DATE('2026-10-22','YYYY-MM-DD'), 'UA', 4.3, 'UPCOMING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Raghava Lawrence', 'Raghava Lawrence, Pooja Hegde', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (10, 'Jailer 2', 'Tiger Muthuvel Pandian returns in this thunderous blockbuster sequel facing an even deadlier pan-Indian weapon syndicate menacing his extended family.', 'Tamil', 'Action, Comedy, Drama', 168, TO_DATE('2026-10-23','YYYY-MM-DD'), 'UA', 4.8, 'UPCOMING', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80', 'Nelson Dilipkumar', 'Rajinikanth, Mohanlal, Shiva Rajkumar', 'Dolby Atmos');

-- Mollywood (Malayalam)
INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (13, 'The Third Murder', 'An intricate investigative Malayalam courtroom drama unraveling the psychological knots of a seemingly open-and-shut homicide confession.', 'Malayalam', 'Crime, Drama, Mystery', 139, TO_DATE('2026-10-01','YYYY-MM-DD'), 'UA', 4.5, 'RUNNING', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', 'Jeethu Joseph', 'Prithviraj Sukumaran, Indrajith Sukumaran', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (14, 'Don''t Trouble The Trouble', 'A rip-roaring fantasy comedy tracking two unwitting small-time hustlers who stumble into an enchanted talisman that makes their wildest white lies come true.', 'Malayalam', 'Comedy, Fantasy', 128, TO_DATE('2026-10-01','YYYY-MM-DD'), 'UA', 4.3, 'RUNNING', 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80', 'Basil Joseph', 'Fahadh Faasil, Dileesh Pothan', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (15, 'Avaraachan And Sons', 'A witty family chronicle revolving around three eccentric sons attempting to resolve their patriarch''s peculiar inheritance stipulations.', 'Malayalam', 'Comedy, Drama, Family', 136, TO_DATE('2026-10-02','YYYY-MM-DD'), 'U', 4.4, 'RUNNING', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80', 'Vipin Das', 'Biju Menon, Suraj Venjaramoodu', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (16, 'Izhakalkkappuram', 'A soul-stirring slow-burn romance capturing the serendipitous convergence of two estranged childhood music prodigies in rain-drenched Wayanad.', 'Malayalam', 'Drama, Music, Romance', 141, TO_DATE('2026-10-02','YYYY-MM-DD'), 'U', 4.2, 'RUNNING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Gautham Vasudev Menon', 'Dulquer Salmaan, Kalyani Priyadarshan', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (17, 'Torpedo', 'A breathless high-seas submarine action thriller involving a veteran naval captain neutralizing an underwater insurgent threat off the Malabar coast.', 'Malayalam', 'Action, Thriller', 144, TO_DATE('2026-10-08','YYYY-MM-DD'), 'UA', 4.6, 'UPCOMING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Sankalp Reddy', 'Tovino Thomas, Joju George', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (19, 'Lucifer 2: Empuraan', 'The monumental second chapter uncovering Stephen Nedumpally alias Khuresh Ab’raam’s globe-spanning empire and ruthless international kingmakers.', 'Malayalam', 'Action, Crime, Drama', 172, TO_DATE('2026-10-15','YYYY-MM-DD'), 'UA', 4.9, 'UPCOMING', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', 'Prithviraj Sukumaran', 'Mohanlal, Prithviraj Sukumaran, Manju Warrier', 'Dolby Atmos');

-- Hollywood (English)
INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (25, 'Digger', 'A heart-stopping excavation survival thriller where an underground rescue team uncovers an impossible subterranean conspiracy beneath Arctic ice.', 'English', 'Action, Thriller', 110, TO_DATE('2026-10-02','YYYY-MM-DD'), 'UA', 4.4, 'RUNNING', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'Baltasar Kormákur', 'Liam Neeson, Michelle Yeoh', '2D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (26, 'Street Fighter', 'Legendary world warriors clash in an exhilarating tournament saga packed with visceral martial arts spectacles and mystical ki mastery.', 'English', 'Action, Adventure, Sci-Fi', 130, TO_DATE('2026-10-09','YYYY-MM-DD'), 'UA', 4.6, 'UPCOMING', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', 'Chad Stahelski', 'Lewis Tan, Andrew Koji, Hiroyuki Sanada', 'IMAX');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (27, 'TRON: Ares', 'A revolutionary digital entity crosses over from the luminous Grid into the real world initiating the next phase of human-technological coexistence.', 'English', 'Action, Adventure, Sci-Fi', 135, TO_DATE('2026-10-09','YYYY-MM-DD'), 'UA', 4.7, 'UPCOMING', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80', 'Joachim Rønning', 'Jared Leto, Greta Lee, Evan Peters', 'IMAX 3D');

INSERT INTO MOVIES (MOVIE_ID, TITLE, DESCRIPTION, LANGUAGE, GENRE, DURATION_MINUTES, RELEASE_DATE, CERTIFICATE, RATING, STATUS, POSTER_URL, DIRECTOR, CAST_INFO, FORMAT) 
VALUES (36, 'Tony', 'An intimate biographical drama capturing the passionate artistry and dramatic life of culinary and culture revolutionary Anthony Bourdain.', 'English', 'Biography, Drama', 120, TO_DATE('2026-10-02','YYYY-MM-DD'), 'UA', 4.2, 'RUNNING', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80', 'Todd Haynes', 'Antonio Banderas, Leo Woodall, Dominic Sessa', '2D');

-- ==================== THEATRES ====================
INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (201, 'PVR Grand Mall', 1, 'Grand Mall, Velachery, Chennai', 12.9815, 80.2180, 4.5, 'Parking,Food Court,Dolby Atmos,4K Projection,Wheelchair Access', '044-28901234', 'pvrgrand@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (202, 'INOX Brookefields', 6, 'Brookefields Mall, R.S. Puram, Coimbatore', 11.0080, 76.9602, 4.3, 'Parking,Food Court,Dolby 7.1,3D', '0422-28905678', 'inoxcbe@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (203, 'AGS Cinemas T.Nagar', 1, '24, Bazullah Road, T.Nagar, Chennai', 13.0418, 80.2341, 4.3, 'Parking,Food Court,Dolby Atmos,IMAX', '044-24340567', 'agstnagar@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (204, 'SPI Palazzo Pondicherry', 2, 'Near Sivaji Statue, ECR, Puducherry', 11.9340, 79.8306, 4.6, 'Dolby Atmos,Luxury Recliner,Sathyam Popcorn', '0413-2345678', 'spipalazzo@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (217, 'PVR INOX White Town', 2, 'Mission Street, White Town, Puducherry', 11.9355, 79.8315, 4.7, 'Dolby Atmos,4K Projection,Gourmet Food,Valet Parking', '0413-2890123', 'pvrwhitetown@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (218, 'CinemaVerse Lawspet', 2, 'Airport Road, Lawspet, Puducherry', 11.9540, 79.8170, 4.5, '2D/3D Screens,Laser Projection,Snack Bar,Two Wheeler Parking', '0413-2980456', 'cinemaverse@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (213, 'Sri Murugan Theatre', 7, 'Beach Road, Near Karaikal Port, Karaikal', 10.9280, 79.8395, 4.3, '4K Projection,Dolby 7.1,Air Conditioned,Parking', '04368-222334', 'murugankkl@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (215, 'Shanmuga Theatre 4K Dolby', 8, 'Public Office Road, Near Railway Station, Nagapattinam', 10.7680, 79.8420, 4.4, 'Dolby Atmos,4K Projection,A/C Comfort,Snack Counter', '04365-244556', 'shanmuganpm@cinego.com');

INSERT INTO THEATRES (THEATRE_ID, NAME, LOCATION_ID, ADDRESS, LATITUDE, LONGITUDE, RATING, AMENITIES, PHONE, EMAIL) 
VALUES (205, 'PVR Orion Mall', 3, 'Brigade Gateway, Rajajinagar, Bengaluru', 13.0107, 77.5556, 4.7, 'IMAX with Laser,4DX,PVR P[XL],Food Court', '080-41234567', 'pvrorion@cinego.com');

-- ==================== SCREENS ====================
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (301, 217, 'Screen 1', 'Dolby Atmos', 85);
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (302, 217, 'Screen 2', '2D', 85);
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (303, 218, 'Audi 1', '2D', 85);
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (304, 218, 'Audi 2', '2D', 85);
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (305, 201, 'Audi 1', '2D', 85);
INSERT INTO SCREENS (SCREEN_ID, THEATRE_ID, SCREEN_NAME, SCREEN_TYPE, TOTAL_SEATS) VALUES (306, 201, 'Audi 2', 'Dolby Atmos', 85);

-- ==================== SEATS ====================
DECLARE
    v_seat_id NUMBER := 1000;
    TYPE screen_arr IS TABLE OF NUMBER;
    v_screens screen_arr := screen_arr(301, 302, 303, 304, 305, 306);
BEGIN
    FOR idx IN 1..v_screens.COUNT LOOP
        -- Premium rows A-C (10 seats/row)
        FOR r IN 1..3 LOOP
            FOR s IN 1..10 LOOP
                INSERT INTO SEATS (SEAT_ID, SCREEN_ID, ROW_NAME, SEAT_NUMBER, SEAT_TYPE)
                VALUES (v_seat_id, v_screens(idx), CHR(64+r), s, 'PREMIUM');
                v_seat_id := v_seat_id + 1;
            END LOOP;
        END LOOP;
        -- Regular rows D-H (9 seats/row)
        FOR r IN 4..8 LOOP
            FOR s IN 1..9 LOOP
                INSERT INTO SEATS (SEAT_ID, SCREEN_ID, ROW_NAME, SEAT_NUMBER, SEAT_TYPE)
                VALUES (v_seat_id, v_screens(idx), CHR(64+r), s, 'REGULAR');
                v_seat_id := v_seat_id + 1;
            END LOOP;
        END LOOP;
        -- Recliner row J (10 seats)
        FOR s IN 1..10 LOOP
            INSERT INTO SEATS (SEAT_ID, SCREEN_ID, ROW_NAME, SEAT_NUMBER, SEAT_TYPE)
            VALUES (v_seat_id, v_screens(idx), 'J', s, 'RECLINER');
            v_seat_id := v_seat_id + 1;
        END LOOP;
    END LOOP;
    COMMIT;
END;
/

-- ==================== SHOWS (October 2026 Active Schedule) ====================
BEGIN
    -- Puducherry White Town PVR INOX - Screen 301 - Baththa (Released 2026-10-01, Show: 2026-10-05)
    CREATE_SHOW(501, 1, 301, TO_DATE('2026-10-05','YYYY-MM-DD'), '10:30 AM', 190);
    CREATE_SHOW(502, 1, 301, TO_DATE('2026-10-05','YYYY-MM-DD'), '01:30 PM', 190);
    CREATE_SHOW(503, 1, 301, TO_DATE('2026-10-05','YYYY-MM-DD'), '07:30 PM', 240);

    -- Puducherry White Town PVR INOX - Screen 302 - Anbil Avan (Released 2026-10-02, Show: 2026-10-05)
    CREATE_SHOW(504, 3, 302, TO_DATE('2026-10-05','YYYY-MM-DD'), '11:00 AM', 180);
    -- Digger (Released 2026-10-02, Show: 2026-10-05)
    CREATE_SHOW(505, 25, 302, TO_DATE('2026-10-05','YYYY-MM-DD'), '06:45 PM', 220);

    -- Puducherry Lawspet CinemaVerse - Screen 303 - Yezhu Kadal Yezhu Malai (Released 2026-10-01)
    CREATE_SHOW(506, 2, 303, TO_DATE('2026-10-05','YYYY-MM-DD'), '01:30 PM', 180);
    CREATE_SHOW(507, 2, 303, TO_DATE('2026-10-05','YYYY-MM-DD'), '07:00 PM', 200);

    -- Puducherry Lawspet CinemaVerse - Screen 304 - Sigma (Released 2026-10-02)
    CREATE_SHOW(508, 4, 304, TO_DATE('2026-10-05','YYYY-MM-DD'), '10:00 AM', 170);

    -- Chennai PVR Grand Mall - Screen 305 - Baththa
    CREATE_SHOW(511, 1, 305, TO_DATE('2026-10-05','YYYY-MM-DD'), '10:30 AM', 200);
    CREATE_SHOW(512, 1, 305, TO_DATE('2026-10-05','YYYY-MM-DD'), '07:30 PM', 260);

    -- Chennai PVR Grand Mall - Screen 306 - Yezhu Kadal Yezhu Malai
    CREATE_SHOW(514, 2, 306, TO_DATE('2026-10-05','YYYY-MM-DD'), '11:15 AM', 210);
    -- Digger
    CREATE_SHOW(515, 25, 306, TO_DATE('2026-10-05','YYYY-MM-DD'), '04:30 PM', 250);
END;
/

-- ==================== FOOD ====================
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (601, 'Small Popcorn', 'Classic salted popcorn - small tub', 'Snacks', 120, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (602, 'Large Popcorn', 'Classic salted popcorn - large tub', 'Snacks', 200, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (603, 'Cheese Popcorn', 'Cheddar cheese flavored popcorn', 'Snacks', 250, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (604, 'Nachos with Salsa', 'Crispy nachos with tomato salsa and cheese dip', 'Snacks', 180, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (605, 'Chicken Sandwich', 'Grilled chicken sandwich with lettuce and mayo', 'Snacks', 220, 1, 0);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (606, 'Veg Burger', 'Crispy veggie patty burger with cheese', 'Snacks', 160, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (607, 'Paneer Wrap', 'Tandoori paneer wrap with mint chutney', 'Snacks', 190, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (608, 'Coca-Cola', 'Chilled Coca-Cola 500ml', 'Beverages', 80, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (609, 'Pepsi', 'Chilled Pepsi 500ml', 'Beverages', 80, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (610, 'Mineral Water', 'Packaged mineral water 1L', 'Beverages', 40, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (611, 'Combo 1 - Movie Magic', 'Large Popcorn + 2 Coke', 'Combos', 280, 1, 1);
INSERT INTO FOOD (FOOD_ID, NAME, DESCRIPTION, CATEGORY, PRICE, IS_AVAILABLE, IS_VEG) 
VALUES (612, 'Combo 2 - Snack Attack', 'Nachos + Pepsi + Small Popcorn', 'Combos', 240, 1, 1);

-- ==================== COUPONS ====================
INSERT INTO COUPONS (COUPON_ID, CODE, DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, EXPIRY_DATE, IS_ACTIVE)
VALUES (1, 'WELCOME100', 'FLAT', 100, 300, NULL, 1000, TO_DATE('2027-12-31','YYYY-MM-DD'), 1);

INSERT INTO COUPONS (COUPON_ID, CODE, DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, EXPIRY_DATE, IS_ACTIVE)
VALUES (2, 'CINEGO20', 'PERCENTAGE', 20, 200, 200, 500, TO_DATE('2027-12-31','YYYY-MM-DD'), 1);

INSERT INTO COUPONS (COUPON_ID, CODE, DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, EXPIRY_DATE, IS_ACTIVE)
VALUES (3, 'FIRST50', 'FLAT', 50, 150, NULL, 2000, TO_DATE('2027-06-30','YYYY-MM-DD'), 1);

INSERT INTO COUPONS (COUPON_ID, CODE, DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, EXPIRY_DATE, IS_ACTIVE)
VALUES (4, 'MOVIE10', 'PERCENTAGE', 10, 100, 100, 5000, TO_DATE('2027-12-31','YYYY-MM-DD'), 1);

INSERT INTO COUPONS (COUPON_ID, CODE, DISCOUNT_TYPE, DISCOUNT_VALUE, MIN_ORDER_AMOUNT, MAX_DISCOUNT, USAGE_LIMIT, EXPIRY_DATE, IS_ACTIVE)
VALUES (5, 'BLOCKBUSTER', 'FLAT', 150, 500, NULL, 300, TO_DATE('2027-03-31','YYYY-MM-DD'), 1);

-- ==================== CUSTOMERS ====================
INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH, ROLE) 
VALUES (1001, 'Admin User', 'admin@cinego.com', '9876543210', 'hashed_admin1234', 'ADMIN');

INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH, ROLE) 
VALUES (1002, 'PVR Manager', 'manager@pvr.com', '9876543211', 'hashed_manager1234', 'THEATRE_MANAGER');

INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH, ROLE) 
VALUES (1003, 'Ravi Kumar', 'ravi@gmail.com', '9000000011', 'hashed_1234', 'CUSTOMER');

INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH, ROLE) 
VALUES (1004, 'Karthik S', 'karthik2026@gmail.com', '9000000012', 'hashed_5678', 'CUSTOMER');

INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH, ROLE)
VALUES (1005, 'Priya M', 'priya@gmail.com', '9000000013', 'hashed_9012', 'CUSTOMER');

-- Link theatre manager
UPDATE THEATRES SET MANAGER_ID = 1002 WHERE THEATRE_ID = 217;

-- ==================== SAMPLE NOTIFICATIONS ====================
INSERT INTO NOTIFICATIONS (NOTIFICATION_ID, CUSTOMER_ID, TITLE, MESSAGE, TYPE)
VALUES (NOTIFICATION_SEQ.NEXTVAL, 1003, 'Welcome to CineGo!', 'Start booking your favorite movies with CineGo. Use code WELCOME100 for your first booking!', 'WELCOME');

INSERT INTO NOTIFICATIONS (NOTIFICATION_ID, CUSTOMER_ID, TITLE, MESSAGE, TYPE)
VALUES (NOTIFICATION_SEQ.NEXTVAL, 1003, 'Advance Booking: Jailer 2', 'Jailer 2 starring Rajinikanth officially opens for booking on Oct 23! Set your reminder.', 'MOVIE');

INSERT INTO NOTIFICATIONS (NOTIFICATION_ID, CUSTOMER_ID, TITLE, MESSAGE, TYPE)
VALUES (NOTIFICATION_SEQ.NEXTVAL, 1004, 'Weekend Offer!', 'Get 20% off on weekend shows. Use code CINEGO20.', 'OFFER');

COMMIT;
