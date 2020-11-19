// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        const newBoardButton = document.querySelector('.new-board');
        newBoardButton.addEventListener('click', dom.addNewBoardTitle);
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        for (let [index, board] of boards.entries()) {
            dom.createBoardElements(board, index)
        }
        dom.listenForBoardTitleClick();
        dom.listenForToggleClick();
        dom.loadStatuses();
    },
    loadStatuses: function () {
        dataHandler.getStatuses(function (statuses) {
            dom.showColumns(statuses);
        });
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },

    // ***** Boards' list overview *****

    createBoardElements: function (board, index) {
        let boardTitle = `<span class="board-title">${board.title}</span>`;
        let headerButtons = `
            <button class="board-add-card">Add Card</button>
            <button class="board-add-column">Add new column</button>
            <form method="post" class="new-status-title">
                <input type="text" name="status" required>
                <button type="submit">Save</button>
            </form>
            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>`;
        const boardHeader = `<div class="board-header" data-board-id="${index+1}">${boardTitle}${headerButtons}</div>`;
        const boardColumns = `<div class="board-columns"></div>`;
        const outerHtml = `<section class="board">${boardHeader}${boardColumns}</section>`;
        let boardContainer = document.querySelector('.board-container');
        boardContainer.insertAdjacentHTML("beforeend", outerHtml);
    },

    // ***** Create public boards *****

    addNewBoardTitle: function () {
        let titleInput = document.querySelector('.new-board-title');
        titleInput.style.display = 'block';
        let submitButton = document.querySelector('.new-board-title button');
        submitButton.addEventListener('click', () => {
            titleInput.style.display = 'none';
        })
    },

    // ***** Rename board *****

    listenForBoardTitleClick: function () {
        let boardNames = document.querySelectorAll('.board-title');
        for (let boardName of boardNames) {
            boardName.addEventListener('click', dom.changeBoardName);
        }
    },
    changeBoardName: function (event) {
        let clickedTitle = event.currentTarget;
        let inputField = dom.getBoardTitleForm(event)
        clickedTitle.parentNode.replaceChild(inputField, clickedTitle);
        let saveButton = document.querySelector('.board-header form button');
        saveButton.addEventListener('click', dom.getChangedBoardTitle);
    },
    getBoardTitleForm: function (event) {
        let clickedTitle = event.currentTarget;

        let newForm = document.createElement('form');
        newForm.setAttribute('method', 'POST');
        newForm.style.display = 'inline';

        let newInput = document.createElement('input');
        newInput.setAttribute('name', 'changed-title');
        newInput.setAttribute("value", `${clickedTitle.textContent}`);

        let newButton = document.createElement('button');
        newButton.innerHTML = 'Save';
        newButton.setAttribute('type', 'submit');

        newForm.appendChild(newInput);
        newForm.appendChild(newButton);

        return newForm;
    },
    getChangedBoardTitle: function () {
        let inputField = document.querySelector('.board-header form input')
        let boardId = inputField.parentElement.parentElement.dataset.boardId;
        let changedBoard = {'id': boardId, 'title': inputField.value};
        dataHandler.renameBoard(changedBoard);
    },

    // ***** Board view with 4 default columns *****

    createColumns: function(status) {
        let boards = document.querySelectorAll('.board-columns');
        for (let board of boards) {
            dom.setBoardVisibility(board, 'none');
            board.insertAdjacentHTML('afterbegin', `
                <div class="board-column">
                    <div class="board-column-title">${status.title}</div>
                    <div class="board-column-content"></div>
                </div>`)
        }
    },
    listenForToggleClick: function () {
        let toggles = document.querySelectorAll(".board-toggle");
        for (let toggle of toggles) {
            toggle.addEventListener("click", dom.showSelectedBoard);
        }
    },
    showSelectedBoard: function(event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let currentBoard = currentBoardContainer.querySelector('.board-columns');
        let currentBoardTitle = currentBoardContainer.querySelector('.board-title');
        let clickedToggle = currentBoardContainer.querySelector('.board-toggle');

        dom.setBoardVisibility(currentBoard, 'flex');
        dom.showNewColumnButton(event);
        clickedToggle.removeEventListener("click", dom.createColumns);
        currentBoardTitle.removeEventListener("click", dom.changeBoardName);
        currentBoardTitle.addEventListener('click', dom.closeBoard);
        dom.listenForColumnTitleClick();
    },
    getCurrentBoardContainer: function(event) {
        let currentHeader = event.currentTarget.parentElement;
        return currentHeader.parentElement;
    },
    setBoardVisibility(currentBoard, displayValue) {
        currentBoard.style.display = displayValue;
    },
    closeBoard: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let toBeClosedBoard = currentBoardContainer.querySelector('.board-columns');
        dom.setBoardVisibility(toBeClosedBoard, 'none');
        dom.hideNewColumnButtons();
        dom.listenForToggleClick();
        dom.listenForBoardTitleClick();
    },

    // ***** Board view with dynamic columns *****

    hideNewColumnButtons: function () {
        let newColumnButtons = document.querySelectorAll('.board-add-column');
        for (let newColumnButton of newColumnButtons) {
            newColumnButton.style.display = 'none';
        }
    },
    showNewColumnButton: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let newColumnButton = currentBoardContainer.querySelector('.board-add-column');
        newColumnButton.style.display = 'inline-block';
        newColumnButton.addEventListener('click', dom.showStatusInput)
    },
    showStatusInput: function (event) {
        let currentBoardContainer = dom.getCurrentBoardContainer(event);
        let statusInput = currentBoardContainer.querySelector('.new-status-title');
        statusInput.style.display = 'inline-block';
        let saveButton = document.querySelector('.new-status-title button');
        saveButton.addEventListener('click', dom.getNewStatus);
    },
    showColumns: function (statuses) {
        for (let status of statuses) {
            dom.createColumns(status)
        }
    },
    getNewStatus: function (event) {
        let button = event.currentTarget;
        let inputField = button.parentElement.querySelector('input');
        let newStatus = inputField.value;
        dataHandler.addStatus(newStatus);
    },

    // ***** Rename columns *****

    listenForColumnTitleClick: function () {
        let columnNames = document.querySelectorAll('.board-column-title');
        for (let columnName of columnNames) {
            columnName.addEventListener('click', dom.changeColumnName);
        }
    },
    changeColumnName: function (event) {
        let clickedTitle = event.currentTarget;
        let inputField = dom.getColumnTitleForm(event)
        clickedTitle.parentNode.replaceChild(inputField, clickedTitle);
        inputField.addEventListener('keypress', dom.handleEnter);
        inputField.addEventListener('keydown', dom.handleEscape);
    },
    getColumnTitleForm: function (event) {
        let clickedTitle = event.currentTarget;

        let newForm = document.createElement('form');
        newForm.setAttribute('method', 'POST');
        newForm.style.display = 'inline';

        let newInput = document.createElement('input');
        newInput.setAttribute('name', 'changed-column-title');
        newInput.setAttribute("value", `${clickedTitle.textContent}`);

        newForm.appendChild(newInput);
        return newForm;
    },
    handleEnter: function (event) {
        if (event.key === 'Enter') {
            dom.getChangedColumnTitle(event);
        }
    },
    getChangedColumnTitle: function (event) {
        let changedColumn = {'original_title': event.target.defaultValue, 'new_title': event.target.value};
        dataHandler.renameColumn(changedColumn);
    },
    handleEscape: function (event) {
        if (event.key === 'Escape') {
            dom.closeColumnInput(event);
        }
    },
    closeColumnInput: function (event) {
        dom.getOriginalColumnTitle(event);
        dom.listenForColumnTitleClick();
    },
    getOriginalColumnTitle: function (event) {
        let inputForm = event.currentTarget;
        let originalTitle = event.target.defaultValue;
        let columnTitle = document.createElement('div');
        columnTitle.setAttribute('class', 'board-column-title');
        columnTitle.textContent = originalTitle;
        inputForm.parentNode.replaceChild(columnTitle, inputForm);
    },
}