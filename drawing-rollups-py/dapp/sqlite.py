import sqlite3 

db_filename = 'drawing.db'

def init_sqlite_database():
    """ create a database connection to an SQLite database """
    conn = None
    # @TODO - add description for the data each column stores
    #     BE
    # (created_at) - replaces date_created
    # (closed_at)

    # FE, required
    # title
    # Description (optional) (new db column)
    # Price for minting (new db column)

    try:
        conn = sqlite3.connect(db_filename)
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS contests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_by VARCHAR NOT NULL,
                title VARCHR NOT NULL,
                description TEXT,
                active_from VARCHAR NOT NULL,
                active_to VARCHAR NOT NULL,
                minting_price FLOAT NOT NULL,
                created_at VARCHAR NOT NULL
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS drawings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid VARCHAR NOT NULL,
                owner VARCHAR NOT NULL,
                dimensions VARCHAR NOT NULL,
                is_private INTEGER,
                title VARCHR NOT NULL,
                description TEXT,
                minting_price FLOAT NOT NULL,
                created_at VARCHAR NOT NULL,
                closed_at VARCHR NOT NULL,
                last_updated VARCHAR NOT NULL,
                contest_id INTEGER NOT NULL,
                FOREIGN KEY (contest_id) REFERENCES contests(id)
            )
            """
        )
        cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS layers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    painter VARCHAR NOT NULL,
                    drawing_objects TEXT NOT NULL,
                    dimensions VARCHAR NOT NULL, 
                    drawing_id INTEGER NOT NULL,
                    FOREIGN KEY (drawing_id) REFERENCES drawings(id)
                )
               """
            )
        cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS mints (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    minter VARCHAR NOT NULL,
                    created_at VARCHAR NOT NULL,
                    drawing_id INTEGER NOT NULL,
                    FOREIGN KEY (drawing_id) REFERENCES drawings(id)
                )
               """
            )
        conn.commit()
        print('Database created successfully!')
    except sqlite3.Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_sqlite_database()