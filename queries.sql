CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    row_number INT NOT NULL,
    seat_number INT NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);


DO $$
BEGIN
    FOR r IN 1..11 LOOP
        IF r < 11 THEN
            FOR s IN 1..7 LOOP
                INSERT INTO seats (row_number, seat_number, is_booked)
                VALUES (r, s, FALSE);
            END LOOP;
        ELSE
            FOR s IN 1..3 LOOP
                INSERT INTO seats (row_number, seat_number, is_booked)
                VALUES (r, s, FALSE);
            END LOOP;
        END IF;
    END LOOP;
END $$;
