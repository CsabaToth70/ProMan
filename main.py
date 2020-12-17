from flask import Flask, render_template, url_for, request, redirect, session, escape, jsonify
import werkzeug
from werkzeug import security

import data_handler
from util import json_response

app = Flask(__name__)

app.secret_key = '\xd4S\xb5\xac5\x98+\x0b*>\xb2\x8bQL)\x97'

@app.route("/", methods=['GET', 'POST'])
def index():
    logged_in = None
    if 'email' in session:
        logged_in = session['email']
    if request.method == 'POST':
        new_title = request.form.get('title', None)
        if new_title:
            data_handler.add_new_board(new_title)
        return redirect("/")
    return render_template('index.html', logged_in=logged_in)


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


@app.route('/get-private-boards/<email>', methods=['GET', 'POST'])
@json_response
def get_private_boards(email):
    return data_handler.get_private_boards(email)


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


@app.route('/registration', methods=['GET', 'POST'])
def register():
    if 'email' not in session:
        error = None
        if request.method == 'POST':
            new_email = request.form['email']
            new_password = request.form['password']
            if data_handler.is_email_taken(new_email):
                error = True
            else:
                hashed_password = werkzeug.security.generate_password_hash(new_password)
                data_handler.add_new_user_data(new_email, hashed_password)
                return redirect('/login')
        return render_template('registration.html', error=error)
    return redirect('/')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        plain_text_password = request.form['password']
        hashed_password = data_handler.get_hashed_pw(email)
        if werkzeug.security.check_password_hash(hashed_password, plain_text_password):
            session['email'] = email
            return redirect('/')
        else:
            return render_template('login.html', logged_in=False, error=True)
    return render_template('login.html', logged_in=False, error=None)


@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect('/')


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route('/add-private-board', methods=['POST'])
@json_response
def add_private_board():
    new_private_board_details = request.json
    data_handler.add_new_private_board(new_private_board_details)
    return ''


@app.route('/delete-card-by-id', methods=['POST'])
@json_response
def delete_card_by_id():
    card_id = request.json
    data_handler.delete_card(card_id)
    return' '


@app.route('/delete-board-by-id', methods=['POST'])
@json_response
def delete_board():
    board_id = request.json
    data_handler.remove_board(board_id)
    return ''


@app.route('/column', methods=['GET', 'POST'])
@json_response
def report_column_ids():
    return data_handler.get_column_ids()


@app.route('/save-column', methods=['POST'])
@json_response
def save_column():
    column_info = request.json
    data_handler.save_new_column(column_info)
    return ''


@app.route('/column-validation', methods=['POST'])
def validate_column():
    column_id = request.json
    return data_handler.validate_column(column_id)


@app.route('/deactivate-column', methods=['POST'])
def deactivate_column():
    column_id = request.json
    data_handler.check_column(column_id)
    return ''


if __name__ == '__main__':
    main()
