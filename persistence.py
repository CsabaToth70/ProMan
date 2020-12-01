from psycopg2.extras import RealDictCursor

import connection

_cache = {}  # We store cached data in this dict to avoid multiple file readings
CARDS_FILE = ''


@connection.connection_handler
def _get_boards(cursor: RealDictCursor):
    query = """
        SELECT * FROM boards
        ORDER BY id;
        """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def _add_new_board(cursor: RealDictCursor, board_title):
    query = """
        INSERT INTO boards
        (title)
        VALUES (%(board_title)s);
        """
    cursor.execute(query, {'board_title': board_title})


@connection.connection_handler
def _update_board_name(cursor: RealDictCursor, changed_data: dict):
    query = """
        UPDATE boards
        SET title = %(board_title)s
        WHERE id = %(board_id)s;
        """
    cursor.execute(query, {'board_title': changed_data['title'], 'board_id': changed_data['id']})


@connection.connection_handler
def _update_column_name(cursor: RealDictCursor, changed_data: dict):
    query = """
        UPDATE statuses
        SET title = %(new_title)s
        WHERE title = %(original_title)s;
        """
    cursor.execute(query, {'new_title': changed_data['new_title'], 'original_title': changed_data['original_title']})


@connection.connection_handler
def _update_card_name(cursor: RealDictCursor, changed_data: dict):
    query = """
            UPDATE cards
            SET title = %(new_title)s
            WHERE id = %(card_id)s;
            """
    cursor.execute(query, {'new_title': changed_data['new_title'], 'card_id': changed_data['card_id']})


@connection.connection_handler
def _add_new_status(cursor: RealDictCursor, status):
    query = """
        INSERT INTO statuses
        (id, title)
        VALUES (NEXTVAL('statuses_id_seq'), %(status)s);
        """
    cursor.execute(query, {'status': status})


@connection.connection_handler
def _get_statuses(cursor: RealDictCursor):
    query = """
        SELECT * FROM statuses
        ORDER BY id DESC;
        """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def _get_cards(cursor: RealDictCursor):
    query = """
        SELECT * FROM cards
        ORDER BY "order" DESC;
        """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def _add_new_card(cursor: RealDictCursor, new_card):
    query = """
        INSERT INTO cards (board_id, title, status_id, "order") VALUES
        (%(board_id)s, %(title)s, %(status_id)s, NEXTVAL('cards_order_seq'));
        
    """
    cursor.execute(query,
                   {'board_id': new_card['board_id'], 'title': new_card['title'], 'status_id': new_card['status_id']})


@connection.connection_handler
def _update_card_status(cursor: RealDictCursor, card_details: dict):
    query = """
        UPDATE cards
        SET status_id = %(status_id)s, "order" = %(order)s
        WHERE id = %(card_id)s;
        """
    cursor.execute(query, {'card_id': card_details['card_id'], 'status_id': card_details['status_id'],
                           'order': card_details['order']})


@connection.connection_handler
def _is_email_taken(cursor: RealDictCursor, new_email: str):
    query = """
        SELECT * FROM users
        WHERE email = %(new_email)s;
        """
    cursor.execute(query, {'new_email': new_email})
    return cursor.fetchall() != []


@connection.connection_handler
def get_hashed_password(cursor: RealDictCursor, email: str):
    query = """
        SELECT password FROM users
        WHERE email = %(email)s;
        """
    cursor.execute(query, {'email': email})
    try:
        result = cursor.fetchone()['password']
        return result
    except TypeError:
        return ""


@connection.connection_handler
def _add_new_user(cursor: RealDictCursor, new_email, hashed_password):
    query = """
        INSERT INTO users (email, password) VALUES
        (%(email)s, %(password)s);

    """
    cursor.execute(query, {'email': new_email, 'password': hashed_password})


def create_new_public_board(board_title):
    _add_new_board(board_title)


def rename_board_title(changed_data):
    _update_board_name(changed_data)


def rename_column_title(changed_data):
    _update_column_name(changed_data)


def rename_card_title(changed_data):
    _update_card_name(changed_data)


def create_new_status(status):
    _add_new_status(status)


def create_new_card(new_card):
    _add_new_card(new_card)


def change_card_status(column_details):
    for card_details in column_details:
        _update_card_status(card_details)


def check_email_availability(new_email):
    return _is_email_taken(new_email)


def create_new_account(new_email, hashed_password):
    _add_new_user(new_email, hashed_password)


def _get_data(data_type, table_function, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = table_function()
    return _cache[data_type]


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', _get_statuses, force)


def get_boards(force=False):
    return _get_data('boards', _get_boards, force)


def get_cards(force=False):
    return _get_data('cards', _get_cards, force)
