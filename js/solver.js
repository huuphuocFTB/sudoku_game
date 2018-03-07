function Solver() {
    // Ma trận khởi tạo
    this.working_grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
};
// Khả năng của 1 số trong hàng
Solver.prototype.validate_row = function (r, c) {
    var value = this.working_grid[r][c];
    for (var _c = 0; _c < 9; _c++) {
        if (_c != c && this.working_grid[r][_c] == value) {
            return false;
        }
    }
    return true;
};
// Khả năng của 1 số trong cột
Solver.prototype.validate_column = function (r, c) {
    var value = this.working_grid[r][c];
    for (var _r = 0; _r < 9; _r++) {
        if (_r != r && this.working_grid[_r][c] == value) {
            return false;
        }
    }
    return true;
};
// Khả năng của 1 số trong khối
Solver.prototype.validate_box = function (r, c) {
    var value = this.working_grid[r][c];
    var box_r = Math.floor(r / 3);
    var box_c = Math.floor(c / 3);

    for (var _r = box_r * 3; _r < box_r * 3 + 3; _r++) {
        for (var _c = box_c * 3; _c < box_c * 3 + 3; _c++) {
            if (_r != r && _c != c && this.working_grid[_r][_c] == value) {
                return false;
            }
        }
    }
    return true;
};
// Hàm quay lui giải
Solver.prototype.backtrack = function (r, c) {
    c++; // Di chuyển đến ô tiếp theo trong hàng
    if (c > 8) { // Di chuyển tới hàng tiếp theo sau khi duyệt qua các ô trong hàng
        c = 0;
        r++;
        if (r > 8) { // Kiểm tra xem đã duyệt hết ma trận chưa
            return true;
        }
    }

    if (this.working_grid[r][c] != 0) { //Di chuyển đến ô tiếp theo nếu người dùng đã nhập một số trong ô hiện tại
        if (!(this.validate_row(r, c) && this.validate_column(r, c) && this.validate_box(r, c))){
            return false;
        }
        return this.backtrack(r, c);
    } else { 
        for (var x = 1; x < 10; x++) { // Đi qua tất cả các con số có thể nếu người dùng đã để lại ô trống
            this.working_grid[r][c] = x;
            if (this.validate_row(r, c) &&  this.validate_column(r, c) && this.validate_box(r, c)){
                if (this.backtrack(r, c)) {
                    return true;
                }
            }
        }
        this.working_grid[r][c] = 0;
        return false;
    }
};

Solver.prototype.solve = function () {
	for(var r = 0; r < 9; r++){
		for(var c = 0; c < 9; c++){ 
            //Kiem tra ma trận đưa vào có hợp lý không.
			if (this.working_grid[r][c] != 0 && !(this.validate_row(r, c) && this.validate_column(r, c) && this.validate_box(r, c))){
    			return false;
			}
		}
	}

    return this.backtrack(0, -1);
};

 