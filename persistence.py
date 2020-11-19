from psycopg2.extras import RealDictCursor
from psycopg2 import sql

import connection

_cache = {}  # We store cached data in this dict to avoid multiple file readings


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


def create_new_public_board(board_title):
    _add_new_board(board_title)


def rename_board_title(changed_data):
    _update_board_name(changed_data)


def rename_column_title(changed_data):
    _update_column_name(changed_data)


def create_new_status(status):
    _add_new_status(status)


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
    return _get_data('cards', CARDS_FILE, force)
