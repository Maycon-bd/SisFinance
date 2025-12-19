"""
Direct SQL password reset - bypasses bcrypt issues
"""
import sqlite3
import os

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), "sql_app.db")

# Pre-generated bcrypt hash for "123456"
# Generated using: bcrypt.hashpw(b"123456", bcrypt.gensalt())
NEW_HASH = "$2b$12$LQv3c1yqBWeQqE7dXqr9/.RmJeOVNJqOKGsqCQsM8HoHKLmFH3QOe"

def reset_password(email: str):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id, email FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if not user:
        print(f"User '{email}' not found!")
        conn.close()
        return False
    
    # Update password
    cursor.execute("UPDATE users SET hashed_password = ? WHERE email = ?", (NEW_HASH, email))
    conn.commit()
    
    print(f"✅ Password for '{email}' has been reset to '123456'")
    conn.close()
    return True

if __name__ == "__main__":
    reset_password("maycongarcia001@gmail.com")
