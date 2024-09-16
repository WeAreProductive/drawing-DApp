import sqlite3 

db_filename = 'drawing.db'

def init_sqlite_database():
    """ create a database connection to an SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_filename)
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS drawings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid VARCHAR UNIQUE NOT NULL,
                dimensions VARCHAR NOT NULL,
                date_created VARCHAR NOT NULL,
                owner VARCHAR NOT NULL,
                action VARCHAR NOT NULL,
                drawing_objects TEXT NOT NULL,
                log TEXT NOT NULL
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