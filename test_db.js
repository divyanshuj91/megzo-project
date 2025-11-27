const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'magikart'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting:', err);
        process.exit(1);
    }

    console.log('Connected to database');

    // Check if columns exist
    db.query('DESCRIBE users', (err, results) => {
        if (err) {
            console.error('Error describing table:', err);
            db.end();
            process.exit(1);
        }

        console.log('\n=== Users Table Structure ===');
        results.forEach(row => {
            console.log(`${row.Field}: ${row.Type} ${row.Null === 'YES' ? '(nullable)' : '(required)'}`);
        });

        // Try to fetch a user
        db.query('SELECT id, full_name, email, role, address, contact_number FROM users LIMIT 1', (err, users) => {
            if (err) {
                console.error('\nError fetching user:', err.message);
            } else {
                console.log('\n=== Sample User ===');
                console.log(users.length > 0 ? users[0] : 'No users found');
            }

            db.end();
        });
    });
});
