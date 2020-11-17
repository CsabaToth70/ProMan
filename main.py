from flask import Flask, render_template, url_for, request, redirect
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    if request.method == 'POST':
        new_title = request.form.get('title', None)
        changed_title = request.form.get('changed-title', None)
        if new_title:
            data_handler.add_new_board(new_title)
        elif changed_title:
            print(changed_title)
        return redirect("/")
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/rename-board")
def rename_board():
    changed_data = request.json
    return data_handler.rename_board(changed_data)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
