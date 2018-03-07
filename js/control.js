var gameFinished = false;
var countblocks = [36,36,34,30,25,24];
var level = 1;
var higlightedCell;
var flag = false;
/* ============== Khởi tạo game ==================*/
	// Khởi tạo một ma trận sudoku
function generateSudoku(){
	/*
		[1, 2, 3, 4, 5, 6, 7, 8, 9
		 4, 5, 6, 7, 8, 9, 1, 2, 3
		 7, 8, 9, 1, 2, 3, 4, 5, 6
		 2, 3, 4, 5, 6, 7, 8, 9, 1
		 5, 6, 7, 8, 9, 1, 2, 3, 4
		 8, 9, 1, 2, 3, 4, 5, 6, 7
		 3, 4, 5, 6, 7, 8, 9, 1, 2
		 6, 7, 8, 9, 1, 2, 3, 4, 5
		 9, 1, 2, 3, 4, 5, 6, 7, 8]
	*/

	var matrix = new Array();
	for(var rowCounter=0;rowCounter<9;rowCounter++){
		matrix[rowCounter] = new Array();
		for(var colCounter=0;colCounter<9;colCounter++){
			var number = colCounter/1 + 1 + (rowCounter*3) + Math.floor(rowCounter/3)%3;
			if(number>9)number = number % 9;
			if(number==0)number=9;
			matrix[rowCounter][colCounter] = number;
		}	
	}

	// Trộn các dòng của ma trận một cách ngẫu nhiên
	for(var no=0;no<9;no+=3){
		for(var no2=0;no2<3;no2++){
			row1 = Math.floor(Math.random()*3);	
			row2 = Math.floor(Math.random()*3);	
			while(row2==row1){
				row2 = Math.floor(Math.random()*3);	
			}
			row1 = row1 + no;
			row2 = row2 + no;			
			var tmpMatrix = new Array();
			tmpMatrix = matrix[row1];
			matrix[row1] = matrix[row2];
			matrix[row2] = tmpMatrix; 				
		}			
	}

	// Trộn các cột của ma trận ngẫu nhiên
	for(var no=0;no<9;no+=3){
		for(var no2=0;no2<3;no2++){
			col1 = Math.floor(Math.random()*3);	
			col2 = Math.floor(Math.random()*3);	
			while(col2==col1){
				col2 = Math.floor(Math.random()*3);	
			}
			col1 = col1 + no;
			col2 = col2 + no;			

			var tmpMatrix = new Array();
			for(var no3=0;no3<matrix.length;no3++){
				tmpMatrixValue = matrix[no3][col1];
				matrix[no3][col1] = matrix[no3][col2];				
				matrix[no3][col2] = tmpMatrixValue;				
			}
		}	
	}

	// Trộn vị trí các số với nhau
	for(var counter=0;counter<30;counter++){
		// Chọn 2 số ngẫu nhiên
		var number1 = Math.ceil(Math.random()*9);
		var number2 = Math.ceil(Math.random()*9);
		while(number2==number1){
			number2 = Math.ceil(Math.random()*9);
		}
		// Tạo 2 mảng tạm lưu vị trí ô
		var tmpObjects1 = new Array();
		var tmpObjects2 = new Array();

		// Đọc vị trí tất cả các ô có cùng số number
		for(var no=0;no<matrix.length;no++){
			for(var no2=0;no2<matrix[no].length;no2++){
				var cell = [no,no2];
				if(matrix[no][no2] == number1)tmpObjects1.push(cell);	
				if(matrix[no][no2] == number2)tmpObjects2.push(cell);
			}
		}
		 // Tiến hành hoán đổi
		for(var no=0;no<tmpObjects1.length;no++){
			var row1 = tmpObjects1[no][0];
			var col1 = tmpObjects1[no][1];
			var row2 = tmpObjects2[no][0];
			var col2 = tmpObjects2[no][1];

			matrix[row1][col1] = number2;
			matrix[row2][col2] = number1;	
		}
	}
	return matrix;
}

	 // Tạo câu đố 
function generatePuzzle(level){
	flag = true;
	var matrix = new Array();
	var sudoku = generateSudoku();
	var cellsRevealed = new Array();
	var numberArray = new Array();
	var groupCountArray = new Array();
	var maxInGroup=5;

	for(var rowCounter=0;rowCounter<9;rowCounter++){
		matrix[rowCounter] = new Array();
		for(var colCounter=0;colCounter<9;colCounter++){
			matrix[rowCounter][colCounter] = 0;
		}	
	}

	if(level<=0)level=1;
	if(level==1)maxInGroup=4;

	for(var no=0;no<countblocks[level];no++){			
		do{
			var row = Math.floor(Math.random()*9);
			var col = Math.floor(Math.random()*9);
			var block = getblock(row,col);
			var number = sudoku[row][col];	
			if(!numberArray[number])numberArray[number]=0;
			if(!groupCountArray[block])groupCountArray[block]=0;
		}while(cellsRevealed[row + '_' + col] || numberArray[number]>(3+Math.ceil(level/2)) || groupCountArray[block]>=maxInGroup);
		cellsRevealed[row + '_' + col] = true;
		if(!numberArray[number])numberArray[number]=0;
		numberArray[number]++;
		groupCountArray[block]++;
		matrix[row][col] = number;
	}
	return matrix;
}
//Lấy giá trị trong cell
function getValueCell(row,col) {
	var cell = document.getElementById("cell_"+row+"_"+col);
	var span = cell.getElementsByTagName('SPAN')[0];
	return span.innerHTML;
}
//Gán giá trị trong cell
function setValueCell(row,col,val) {
	var cell = document.getElementById("cell_"+row+"_"+col);
	var span = cell.getElementsByTagName('SPAN')[0];
	span.innerHTML = val;
}
// Lấy ra số thứ tự khối
function getblock(row,col){
	var width = 3;
	var majorRow = Math.floor(row / width);
	var majorCol = Math.floor(col / width);
	return majorCol + majorRow * 3;
}

// Thay đổi cấp độ
function switchLevel(initLevel,linkObj)
{
	var confirmSwitch = gameFinished;
	if(!confirmSwitch)confirmSwitch = confirm('Click OK to finish the current game');
	if(confirmSwitch){
		var parentObj = linkObj.parentNode.parentNode;
		var links = parentObj.getElementsByTagName('A');
		for(var no=0;no<links.length;no++){
			links[no].className = '';
		}
		linkObj.className = 'active';
		level = initLevel;
		setTimeout(function(){
			initSudoku(level);
		},20);		
	}
}


/*=============== Điều Khiển Trên Giao Diện =======================*/
// Clear
function newGame(){
	flag = false;
	gameFinished =false;
	var obj = document.getElementById('sudoku');
	var subObjects = obj.getElementsByTagName('DIV');
	for(var no=0;no<subObjects.length;no++){
		if(subObjects[no].className.indexOf('cells') >= 0){
			var span = subObjects[no].getElementsByTagName('SPAN');
			span[0].innerHTML = '';
			subObjects[no].className = "cells";
			subObjects[no].removeAttribute("style");
			subObjects[no].removeAttribute("disabled");
			subObjects[no].onclick = highlightSquare;
			higlightedCell = "";
		}
	}
	if(document.all){
		document.body.onkeydown = insertNumber;
	}else{
		document.documentElement.onkeydown = insertNumber;
	}
}

// Thêm câu đố vào 
function initSudoku(){
	newGame();
	flag = true;
	var Puzzle = generatePuzzle(level);
	for(var no=0;no<Puzzle.length;no++)
		for(var no2=0;no2<Puzzle.length;no2++){
			if(Puzzle[no][no2] != 0) {
				setValueCell(no,no2,Puzzle[no][no2]);
				var cell = document.getElementById('cell_'+no+"_"+no2);
				cell.setAttribute("disabled","true");
			}
		}
}

// Kiểm tra game đã kết thúc chưa
function isGameFinished(){
	var sudoku = document.getElementById('sudoku');
	var div = sudoku.getElementsByTagName('DIV');
	var allOk = true;
	for(var no=0;no<div.length;no++){
		if(div[no].className.indexOf('cells')>=0 && !div[no].getAttribute("disabled")){
			var span = div[no].getElementsByTagName('SPAN')[0];
			var numbers = div[no].id.split("_");
			var row = numbers[1];
			var col = numbers[2];
			var val = span.innerHTML;
			if(span.innerHTML == "" || !isCorrect(row,col,val)){
				allOk=false;
				break;
			}
		}	
	}
	if(allOk) {
		alert('Congratulations! You did it');
		gameFinished = true;
	}

}

// Kiểm tra trong cùng cột có các ô cùng giá trị num
function sameCol(col,num=""){
	var pos = new Array();
	for(var no=0; no<9;no++){
		if(getValueCell(no,col) == num) pos.push([no,col]);
	}
	return pos;
}
// Kiểm tra trong cùng hàng có các ô cùng giá trị num
function sameRow(row,num=""){
	var pos = new Array();
	for(var no=0; no<9;no++){
		if(getValueCell(row,no) == num) pos.push([row,no]);
	}
	return pos;
}

// Kiểm tra khối
function sameblock(block,num=""){
	var block = document.getElementById('block_'+block);
	var div = block.getElementsByTagName('DIV');
	var pos = new Array();

	for(var no=0;no<div.length;no++){
		if(div[no].className.indexOf('cells') >= 0){
			var span = div[no].getElementsByTagName('SPAN')[0];
			if(span.innerHTML == num){
				var numbers = div[no].id.split('_');
				pos.push([numbers[1],numbers[2]]);
			} 
		}
	}
	return pos;
}

// Kiểm tra đúng sai
function isCorrect(row,col,val){
	if(sameRow(row,val).length>1 || sameCol(col,val).length>1 || sameblock(getblock(row,col),val).length>1){
		return false;
	}else{
		return true;
	}
}
// Thay đổi Màu Ô
function changeColorCell(row,col) {
	var cell = document.getElementById('cell_'+row+"_"+col);
	if(cell.getAttribute("disabled")) {
		cell.style.backgroundColor = "rgba(255,0,0,0.5)";
	}
	else{
		cell.style.backgroundColor = "red";
	}
	cell.style.color = "#FFF";
}
// Gợi Ý Ô Trùng
function checkCells(){
	var obj = document.getElementById('sudoku');
	var subObjects = obj.getElementsByTagName('DIV');
	// Reset Style
	for(var no=0;no<subObjects.length;no++){
		if(subObjects[no].className.indexOf('cells') >= 0){
			subObjects[no].removeAttribute("style");
		}
	}

	for (no=0;no<subObjects.length;no++) {
		if(subObjects[no].className.indexOf('cells') >= 0){
			var val = subObjects[no].getElementsByTagName('SPAN')[0].innerHTML;
			if(val != ""){
				var numbers = subObjects[no].id.split('_');
				var row = numbers[1]/1;
				var col = numbers[2]/1;
				var cellsRow = sameRow(row,val); // Các ô giống nhau trên cùng hàng
				var cellsCol = sameCol(col,val); // Các ô giống nhau trên cùng khối
				var cellsBlock = sameblock(getblock(row,col),val); // Các ô giống nhau trên cùng dòng
		
				if(cellsRow.length>1){ //Các ô trên cùng hàng có cùng giá trị đổi màu
					for (var no2=0;no2<cellsRow.length;no2++) {
						changeColorCell(cellsRow[no2][0],cellsRow[no2][1]);
					}
				}

				if(cellsCol.length>1){ //Các ô trên cùng cột có cùng giá trị đổi màu
					for (var no2=0;no2<cellsCol.length;no2++) {
						changeColorCell(cellsCol[no2][0],cellsCol[no2][1]);
					}
				}

				if(cellsBlock.length>1){ //Các ô trên cùng khối có cùng giá trị đổi màu
					for (var no2=0;no2<cellsBlock.length;no2++) {
						changeColorCell(cellsBlock[no2][0],cellsBlock[no2][1]);
					}
				}

			}
		}
	}
}
//Kiểm Soát Nhập
function highlightSquare(e,inputObj){
	if(!inputObj)inputObj = this;	
	if(inputObj.getAttribute("disabled"))return;
	if(gameFinished)return;
	inputObj.className='cellsHighlighted';
	if(higlightedCell && higlightedCell!=inputObj)higlightedCell.className='cells';
	higlightedCell = inputObj;
	if(document.all)inputObj.focus();
}
//Hàm nhận biết ký tự bàn phím và xử lý
function insertNumber(e){
	if(document.all)e = event;
	if(!higlightedCell)return;
	if(gameFinished)return;
	if (e.keyCode) code = e.keyCode; else if (e.which) code = e.which;
	var span = higlightedCell.getElementsByTagName('SPAN')[0];

	var numbers = higlightedCell.id.split('_');
	var row = numbers[1]/1;
	var col = numbers[2]/1;
	var nextObject = false;

	if(code==39){ // Right arrow
		if(col<8){
			nextObject = document.getElementById('cell_' + row + '_' + (col/1+1));
			if(nextObject.getAttribute("disabled")){
				while(col<8 && nextObject.getAttribute("disabled")){
					col = col+1;
					nextObject = document.getElementById('cell_' + row + '_' + col);
				}
			}				
		}
	}
	if(code==37){ // Left arrow
		if(col>0){
			nextObject = document.getElementById('cell_' + row + '_' + (col/1-1));
			if(nextObject.getAttribute("disabled")){
				while(col>0 && nextObject.getAttribute("disabled")){
					col = col-1;
					nextObject = document.getElementById('cell_' + row + '_' + col);
				}
			}
		}
	}
	if(code==38){
		if(row>0){
			nextObject = document.getElementById('cell_' + (row-1) + '_' + col);
			if(nextObject.getAttribute("disabled")){
				while(row>0 && nextObject.getAttribute("disabled")){
					row = row-1;
					nextObject = document.getElementById('cell_' + row + '_' + col);
				}
			}				
		}
	}
	
	if(code==40){
		if(row<8){
			nextObject = document.getElementById('cell_' + (row+1) + '_' + col);
			if(nextObject.getAttribute("disabled")){
				while(row<8 && nextObject.getAttribute("disabled")){
					row = row+1;
					nextObject = document.getElementById('cell_' + row + '_' + col);
				}
			}	
		}
	}

	if(nextObject){
		highlightSquare(false,nextObject);
	}

	if(code==46 || code==8){	// Delete
		span.innerHTML = '';
	}
	if(code>96 && code<=105)code-=48;
	if(code>48 && code<=57){				
		var theChar = String.fromCharCode(code);
		span.innerHTML = theChar;
	}
	checkCells();
	isGameFinished();
}

function solve(){
	var solver = new Solver();
	for(var rowCounter = 0; rowCounter < 9; rowCounter++){
		for(var colCounter = 0; colCounter < 9; colCounter++){
			var cell = document.getElementById("cell_" + rowCounter + "_" + colCounter);
			var value = cell.getElementsByTagName('SPAN')[0].innerHTML;
			
			if(flag == true){
				if(value!=""){
					if(cell.getAttribute("disabled")){
						solver.working_grid[rowCounter][colCounter] = value;
						cell.style.backgroundColor = "#ccc";
					}else{
						cell.removeAttribute("style");
					}
				}
			}else{
				solver.working_grid[rowCounter][colCounter] = value;
				if(value!="") cell.setAttribute("disabled","true");
			}
			
		}
	}
	if(solver.solve()) {
		for (var rowCounter = 0; rowCounter < 9; rowCounter++) {
			for (var colCounter = 0; colCounter < 9; colCounter++) {
				setValueCell(rowCounter,colCounter,solver.working_grid[rowCounter][colCounter]);
				cell.readOnly = true;
			}
		}
	}else{
		alert("No solutions found!");
	}
	isGameFinished();
}

// Save Game
function save() {
	 var textToWrite = "";
	var matrix = new Array();
	for(var rowCounter = 0; rowCounter < 9; rowCounter++){
		matrix[rowCounter] = new Array();
		for(var colCounter = 0; colCounter < 9; colCounter++){
			var cell = document.getElementById("cell_" + rowCounter + "_" + colCounter);
			var value = cell.getElementsByTagName('SPAN')[0].innerHTML;
			textToWrite +=  (value!="") ? value : "0";
			textToWrite += " ";

		}
		textToWrite += "\r\n";
	}

    
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "Sudoku_puzzle";


    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}


function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
