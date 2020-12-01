from flask import Flask, render_template, url_for, request, redirect, session, escape
import werkzeug
from werkzeug import security

import data_handler
from util import json_response

app = Flask(__name__)

app.secret_key = '\xd4S\xb5\xac5\x98+\x0b*>\xb2\x8bQL)\x97'

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
            session['email'] = request.form['email']
            return render_template('index.html', email=escape(session['email']))
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


if __name__ == '__main__':
    main()
