from flask import Flask, render_template, url_for, request, redirect

import data_handler
from util import json_response

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        new_title = request.form.get('title', None)
        if new_title:
            data_handler.add_new_board(new_title)
        return redirect("/")
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    return data_handler.get_boards()


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_all_statuses()


@app.route("/rename-board", methods=['POST'])
@json_response
def rename_board():
    changed_data = request.json
    return data_handler.rename_board(changed_data)


@app.route("/rename-column", methods=['POST'])
def rename_column():
    changed_data = request.json
    return data_handler.rename_column(changed_data)


@app.route("/rename-card", methods=['POST'])
def rename_card():
    changed_data = request.json
    return data_handler.rename_card(changed_data)


@app.route("/add-status", methods=['POST'])
@json_response
def add_status():
    new_status = request.json
    data_handler.add_new_status(new_status)
    return ''


@app.route("/get-cards/<int:board_id>", methods=['GET', 'POST'])
@json_response
def get_cards_for_board(board_id):
    return data_handler.get_cards_for_board(board_id)


@app.route("/add-card", methods=['POST'])
@json_response
def add_card():
    new_card = request.json
    data_handler.add_new_card(new_card)
    return ''


@app.route("/update-card-status", methods=['POST'])
@json_response
def update_card_status():
    column_details = request.json
    data_handler.update_card_status(column_details)
    return ''


@app.route('/login')
def login():
    pass

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
