"""
Fix password hash using passlib to ensure compatibility with the backend
"""
import sqlite3
from passlib.context import CryptContext

# Use the same pwd_context as the backend
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Path to the database
db_path = "sql_app.db"

def reset_password(email: str, new_password: str):
    # Generate the hash using passlib (same as backend)
    hashed = pwd_context.hash(new_password)
    print(f"Generated hash: {hashed}")
    
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
    cursor.execute("UPDATE users SET hashed_password = ? WHERE email = ?", (hashed, email))
    conn.commit()
    
    # Verify the update
    cursor.execute("SELECT hashed_password FROM users WHERE email = ?", (email,))
    updated_hash = cursor.fetchone()[0]
    
    # Verify the hash works
    if pwd_context.verify(new_password, updated_hash):
        print(f"Password for '{email}' has been reset to '{new_password}'")
        print("Verification: SUCCESS")
    else:
        print("Verification: FAILED")
    
    conn.close()
    return True

if __name__ == "__main__":
    reset_password("maycongarcia001@gmail.com", "123456")
