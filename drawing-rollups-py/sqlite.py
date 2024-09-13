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
            CREATE TABLE IF NOT EXISTS drawing (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                owner TEXT NOT NULL
            )
            """
        )

        conn.commit()
        print(sqlite3.sqlite_version)
    except sqlite3.Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_sqlite_database()