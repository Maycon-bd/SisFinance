from sqlalchemy import create_engine, text
import sys

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL)

def run_migration():
    with engine.connect() as conn:
        print("Running migration...")
        
        # 1. Create credit_cards table
        print("Creating credit_cards table...")
        try:
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS credit_cards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(100) NOT NULL,
                `limit` NUMERIC(12, 2) NOT NULL DEFAULT 0,
                closing_day INTEGER NOT NULL,
                due_day INTEGER NOT NULL,
                color VARCHAR(7),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """))
            print("credit_cards table created!")
        except Exception as e:
            print(f"Error creating table: {e}")

        # 2. Add columns to transactions
        print("Adding columns to transactions...")
        columns_to_add = [
            ("credit_card_id", "INTEGER REFERENCES credit_cards(id)"),
            ("installment_number", "INTEGER"),
            ("total_installments", "INTEGER")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE transactions ADD COLUMN {col_name} {col_type}"))
                print(f"Added column {col_name}")
            except Exception as e:
                # Use string check safely
                msg = str(e).lower()
                if "duplicate column" in msg or "already exists" in msg:
                    print(f"Column {col_name} already exists")
                else:
                    print(f"Error adding {col_name}: {e}")

        # 3. Update recurring_transactions (Make bank_id nullable and add credit_card_id)
        # SQLite cannot ALTER column nullability, so we recreate the table
        print("Updating recurring_transactions...")
        
        try:
            # Check if credit_card_id exists to avoid re-running heavy migration if not needed
            # But we also need to fix bank_id nullability.
            
            conn.execute(text("BEGIN TRANSACTION"))
            
            # Create new table
            conn.execute(text("""
            CREATE TABLE recurring_transactions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                category_id INTEGER,
                bank_id INTEGER, -- Now Nullable
                credit_card_id INTEGER, -- New Column
                amount NUMERIC(12, 2) NOT NULL,
                type VARCHAR(20) NOT NULL,
                day_of_month INTEGER NOT NULL,
                description VARCHAR(255),
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(category_id) REFERENCES categories(id),
                FOREIGN KEY(bank_id) REFERENCES banks(id),
                FOREIGN KEY(credit_card_id) REFERENCES credit_cards(id)
            )
            """))
            
            # Copy data (if old table exists)
            # We assume old table has: id, user_id, category_id, bank_id, amount, type, day_of_month, description, is_active, created_at
            conn.execute(text("""
            INSERT INTO recurring_transactions_new (id, user_id, category_id, bank_id, amount, type, day_of_month, description, is_active, created_at)
            SELECT id, user_id, category_id, bank_id, amount, type, day_of_month, description, is_active, created_at FROM recurring_transactions
            """))
            
            # Drop old and rename new
            conn.execute(text("DROP TABLE recurring_transactions"))
            conn.execute(text("ALTER TABLE recurring_transactions_new RENAME TO recurring_transactions"))
            
            conn.execute(text("COMMIT"))
            print("recurring_transactions table updated!")
            
        except Exception as e:
            conn.execute(text("ROLLBACK"))
            print(f"Error updating recurring_transactions: {e}")

if __name__ == "__main__":
    run_migration()
