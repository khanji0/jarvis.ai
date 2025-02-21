import sqlite3

# Connect to the database
conn = sqlite3.connect('backend/database/user.db')
cursor = conn.cursor()

# Execute a query to fetch all rows from the users table
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()

# Print the contents of the table
for row in rows:
    print(row)

# Close the connection
conn.close()
