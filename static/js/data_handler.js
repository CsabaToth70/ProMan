export let dataHandler = {
    _data: {},
    _api_get: function (url, callback) {
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    _api_post: function (url, data) {
        return fetch(url, {
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

    getPrivateBoards: function (email, callback) {
        this._api_get(`/get-private-boards/${email}`, (response) => {
            this._data['private_boards'] = response;
            callback(response);
        }, email);
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

    },
    getCardsByBoardId: function (boardId, callback) {
        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data['cards'] = response;
            callback(response);
        }, boardId);
    },
    getCard: function (cardId, callback) {

    },
    createNewBoard: function (boardTitle, callback) {

    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        let cardDict = {'title': cardTitle, 'board_id': parseInt(boardId), 'status_id': parseInt(statusId)};
        await this._api_post('/add-card', cardDict);

        // creates new card, saves it and calls the callback function with its data
    },
    renameBoard: async function (changedBoardData) {
        await this._api_post('/rename-board', changedBoardData);
    },
    addStatus: async function (newStatus) {
        await this._api_post('/add-status', newStatus);
    },
    renameColumn: async function (changedColumnData) {
        await this._api_post('/rename-column', changedColumnData);
    },
    renameCard: async function (changedCardData) {
        await this._api_post('/rename-card', changedCardData);
    },
    changeDragAndDropStatus: async function (columnDetails) {
        await this._api_post('/update-card-status', columnDetails);
    },
    NewPrivateBoard: function (newPrivateBoardDict) {
        this._api_post('/add-private-board', newPrivateBoardDict);
    },
    deleteCardById: function (cardId) {
        this._api_post('/delete-card-by-id', cardId);
    },
    removeBoard: async function (boardId) {
        await this._api_post('/delete-board-by-id', boardId);
    },
    queryColumnList: async function () {
        return await this._api_post('/column', 'True');
    },
    saveColumnId: async function (columnId, boardId, statusId, isActive) {
        let columnInfo = [columnId, boardId, statusId, isActive];
        await this._api_post('/save-column', columnInfo);
    },
    checkValidation: async function (columnId) {
        return await this._api_post('/column-validation', columnId);
    },
    deActivateColumn: function (columnId) {
        this._api_post('/deactivate-column', columnId);
    }
};
