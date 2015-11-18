var _boardArray = [];
var i = 0;
var j = 0;
var cellObject = {
    id: i + '' + j,
    status: 'none',
    piece: '',
    available: '',
    color: '',
    clicked: ''
};
var currentObject;
var currentObject2;
var currentObject3;
var currentRow;
var currentCell;

setupBoard();
function setupBoard(){
    var gameBoardDiv = document.getElementById('motherBoard');
    for (var i = 0; i < 8; i++){
        var row = document.createElement('div');
        row.setAttribute('id', 'row' + i);
        row.setAttribute('class', 'row');
        var rowArray = [];
        for (var j = 0; j < 8; j++){
            var cellObject = {
                id: i + '' + j,
                status: 'none'
            };
            var cell = document.createElement('div');
            cell.setAttribute('id', i + '' + j);
            if (isEven(i) && isEven(j)){
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }else if (isEven(i) && !isEven(j)){
                cellObject.color = 'white';
                cell.addEventListener("click", function (event){
                    console.log(event);
                    movePiece(event.target.id);
                    cellObject.clicked = 'true';
                });
                if (i < 3){
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if (i > 4){
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                }else{
                    cell.setAttribute('class', 'white-cell');
                }
            }else if (!isEven(i) && isEven(j)){
                cellObject.color = 'white';
                cell.addEventListener("click", function (event){
                    console.log(event);
                    movePiece(event.target.id);
                    cellObject.clicked = 'true';
                });
                if (i < 3){
                    cell.setAttribute('class', 'white-cell red-piece');
                    cellObject.piece = 'red';
                    cellObject.status = 'piece';
                }else if (i > 4){
                    cell.setAttribute('class', 'white-cell black-piece');
                    cellObject.piece = 'black';
                    cellObject.status = 'piece';
                }else{
                    cell.setAttribute('class', 'white-cell');
                }
            }else{
                cell.setAttribute('class', 'black-cell');
                cellObject.color = 'black';
            }
            row.appendChild(cell);
            rowArray.push(cellObject);
        }
        gameBoardDiv.appendChild(row);
        _boardArray.push(rowArray);
    }
}

function isEven(number){
    return number % 2 === 0;
}

function movePiece(cellObject){
    var idArray = cellObject.split('');
    var currentRow = idArray[0];
    var currentCell = idArray[1];
    var currentObject = _boardArray[currentRow][currentCell]
    console.log(currentObject.piece)
    if (currentObject.status === 'piece'){
        checkAvailability(cellObject);
        for (var m = 0; m < _boardArray.length; m++){
            for (var n = 0; n < _boardArray[m].length; n++){
                if (_boardArray[m][n].clicked === true && _boardArray[m][n].status === 'none'){
                    _boardArray[m][n].status = 'piece';
                    if (currentObject.piece === 'red'){
                        _boardArray[m][n].piece = 'red';
                        document.getElementById(_boardArray[m][n].id).setAttribute('class', 'red-piece');
                    }else if (currentObject.piece === 'black'){
                        _boardArray[m][n].piece = 'black';
                        document.getElementById(_boardArray[m][n].id).setAttribute('class', 'black-piece');
                    }
                currentObject.status = 'none';
                currentObject.piece = '';
                currentObject.clicked = '';
                }
            }
        }
    }
}

function checkAvailability(cellObject){
    var idArray = cellObject.split('');
    var currentRow = idArray[0];
    var currentCell = idArray[1];
    var currentObject = _boardArray[currentRow][currentCell]
    if (currentObject.piece === 'red'){
        var currentObject2 = _boardArray[currentRow++][currentCell++];
        var currentObject2 = _boardArray[currentRow][currentCell];
        var currentObject3 = _boardArray[currentRow][currentCell--];
        var currentObject3 = _boardArray[currentRow][currentCell--];
        var currentObject3 = _boardArray[currentRow][currentCell];
        if (currentObject2.status === 'none'){
            currentObject2.color = 'green';
            currentObject2.available = true;
        }
        if (currentObject3.status === 'none'){
            currentObject3.color = 'green';
            currentObject3.available = true;
        }
    }else if (currentObject.piece === 'black'){
        // var currentObject2 = _boardArray[currentRow++][currentCell++];
        // var currentObject2 = _boardArray[currentRow][currentCell];
        // var currentObject3 = _boardArray[currentRow][currentCell--];
        // var currentObject3 = _boardArray[currentRow][currentCell--];
        // var currentObject3 = _boardArray[currentRow][currentCell];
        if (_boardArray[currentRow - 1][currentCell + 1].status === 'none'){
            cellObject.color = 'green';
            cellObject.available = true;
        }
        if (_boardArray[currentRow - 1][currentCell - 1].status === 'none'){
            cellObject.color = 'green';
            cellObject.available = true;
        }
    }
    updateBoard();
    movePiece();
}

function updateBoard(){
    for (var k = 0; k < _boardArray.length; k++){
        for (var l = 0; l < _boardArray[k].length; l++){
            if (_boardArray[k][l].available === true){
                document.getElementById(_boardArray[k][l].id).setAttribute('class', 'available-cell');
            }
        }
    }
}
