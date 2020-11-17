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
        let boardTitle = `<div class="board-title">${board.title}</div>`;
        let headerButtons = `
            <button class="board-add">Add Card</button>
            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>`;
        const boardHeader = `<div class="board-header" data-board-id="${index+1}">${boardTitle}${headerButtons}</div>`;
        const boardColumns = `<div class="board-columns">BoardColumns</div>`;
        const outerHtml = `<div class="board">${boardHeader}${boardColumns}</div>`;
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
        let changedBoard = {'id': boardId, 'title': inputField};
        dataHandler.renameBoard(changedBoard);
    }
};

