from psycopg2.extras import RealDictCursor
from psycopg2 import sql

import connection

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'

BOARD_HEADER = ['id', 'title']

_cache = {}  # We store cached data in this dict to avoid multiple file readings


@connection.connection_handler
def _get_boards(cursor: RealDictCursor):
    query = """
        SELECT * FROM boards;
        """
    cursor.execute(query)
    return cursor.fetchall()


def _write_csv(file_name, data_dict, header):
    with open(file_name, 'a') as boards:
        writer = csv.DictWriter(boards, fieldnames=header)
        writer.writerow(data_dict)


@connection.connection_handler
def _add_new_board(cursor: RealDictCursor, board_title):
    query = """
        INSERT INTO boards
        (title)
        VALUES (%(board_title)s);
        """
    cursor.execute(query, {'board_title': board_title})


def create_new_public_board(board_title):
    _add_new_board(board_title)


def generate_id(file_name):
    data_list = _read_csv(file_name)
    id_numbers = [int(dict_data['id']) for dict_data in data_list]
    new_id = max(id_numbers) + 1
    return new_id


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
    return _get_data('statuses', STATUSES_FILE, force)


def get_boards(force=False):
    return _get_data('boards', _get_boards, force)


def get_cards(force=False):
    return _get_data('cards', CARDS_FILE, force)
