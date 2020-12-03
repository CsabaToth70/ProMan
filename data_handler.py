import persistence


def add_new_board(new_title):
    persistence.create_new_public_board(new_title)


def rename_board(changed_data):
    persistence.rename_board_title(changed_data)


def rename_column(changed_data):
    persistence.rename_column_title(changed_data)


def rename_card(changed_data):
    persistence.rename_card_title(changed_data)


def get_all_statuses():
    return persistence.get_statuses(force=True)


def add_new_status(status):
    persistence.create_new_status(status)


def add_new_card(new_card):
    persistence.create_new_card(new_card)


def update_card_status(column_details):
    persistence.change_card_status(column_details)


def is_email_taken(new_email):
    return persistence.check_email_availability(new_email)


def get_hashed_pw(email):
    return persistence.get_hashed_password(email)


def add_new_user_data(new_email, hashed_password):
    persistence.create_new_account(new_email, hashed_password)


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == status_id), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == board_id:
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def add_new_private_board(new_private_board_details):
    persistence.add_new_private_board_to_sql(new_private_board_details)


def get_private_boards(email):
    return persistence.get_private_board_by_user(email)


def delete_card(card_id):
    return persistence.delete_card_by_id(card_id)

def remove_board(board_id):
    return persistence.delete_board_by_id(board_id)