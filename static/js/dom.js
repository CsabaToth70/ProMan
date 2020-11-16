// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
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

        for (let board of boards) {
            let boardTitle = ` <div class="board-title">${board.title}</div>`;
            const outerHtml = `<div class="board"></div>`;
            const boardHeader = `<div class="board-header"> ${boardTitle}</div>`
            const boardColumns = `<div class="board-columns"> BoardColumns</div>`

            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
            let boardElement = document.querySelector('.board');
            boardElement.insertAdjacentHTML("beforeend", boardHeader);
            boardElement.insertAdjacentHTML('beforeend', boardColumns);
        }


    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
