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
                uuid TEXT NOT NULL,
                dimensions TEXT NOT NULL,
                date_created TEXT NOT NULL,
                owner TEXT NOT NULL,
                action TEXT NOT NULL,
                drawing_objects TEXT NOT NULL
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