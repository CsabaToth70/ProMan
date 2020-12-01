// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => callback(json_response));
    },
    _api_post: function (url, data) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
    },
    init: function () {
    },
    getBoards: function (callback) {
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
            this._api_get(`/get-cards/${boardId}`,  (response) => {
            this._data['cards'] = response;
            callback(response);
        }, boardId);
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: function (cardTitle, boardId, statusId) {
        let cardDict = {'title':cardTitle, 'board_id':parseInt(boardId), 'status_id': parseInt(statusId)};
        this._api_post('/add-card', cardDict);

        // creates new card, saves it and calls the callback function with its data
    },
    renameBoard: function (changedBoardData) {
        this._api_post('/rename-board', changedBoardData);
    },
    addStatus: function (newStatus) {
        this._api_post('/add-status', newStatus);
    },
    renameColumn: function (changedColumnData) {
        this._api_post('/rename-column', changedColumnData);
    },
    renameCard: function (changedCardData) {
        this._api_post('/rename-card', changedCardData);
    },
};
