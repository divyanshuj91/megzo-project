const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'magikart'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }

    console.log('Connected to MySQL database');

    // Add columns if they don't exist
    const alterQuery = `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS address TEXT,
        ADD COLUMN IF NOT EXISTS contact_number VARCHAR(20)
    `;

    connection.query(alterQuery, (err) => {
        if (err) {
            // If the MySQL version doesn't support IF NOT EXISTS, try without it
            console.log('Trying alternative method...');

            const checkQuery = "SHOW COLUMNS FROM users LIKE 'address'";
            connection.query(checkQuery, (err, results) => {
                if (err) {
                    console.error('Error checking columns:', err);
                    connection.end();
                    process.exit(1);
                }

                if (results.length === 0) {
                    // Column doesn't exist, add it
                    connection.query('ALTER TABLE users ADD COLUMN address TEXT', (err) => {
                        if (err) {
                            console.error('Error adding address column:', err);
                        } else {
                            console.log('Added address column');
                        }

                        // Add contact_number column
                        connection.query('ALTER TABLE users ADD COLUMN contact_number VARCHAR(20)', (err) => {
                            if (err) {
                                console.error('Error adding contact_number column:', err);
                            } else {
                                console.log('Added contact_number column');
                            }

                            console.log('\nDatabase schema updated successfully!');
                            connection.end();
                        });
                    });
                } else {
                    console.log('Columns already exist!');
                    connection.end();
                }
            });
        } else {
            console.log('Columns added successfully!');
            connection.end();
        }
    });
});
