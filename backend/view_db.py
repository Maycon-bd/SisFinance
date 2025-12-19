import sqlite3

conn = sqlite3.connect('sql_app.db')
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("=== TABELAS ===")
for t in tables:
    print(f"  - {t[0]}")

# Show users
print("\n=== USUÁRIOS ===")
cursor.execute("SELECT id, email, full_name FROM users")
for row in cursor.fetchall():
    print(f"  ID: {row[0]}, Email: {row[1]}, Nome: {row[2]}")

conn.close()
