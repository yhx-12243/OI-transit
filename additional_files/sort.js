(function (win, und){
	
	"use strict";
	
	var
		sortHook = 'np ncia',
		// natural order
		// problem-id order
		// concept-difficulty order
		// implementation-difficulty order
		// algorithm order
		sortFunc = {
			
			'n': function (a, b) {return (+b.cells[0].innerText) - (+a.cells[0].innerText);},
			
			'nr': function (a, b) {return (+a.cells[0].innerText) - (+b.cells[0].innerText);},
			
			'p': function (a, b){
				var A = a.cells[1].innerText, B = b.cells[1].innerText;
				return A == B ? 0 : (A < B ? -1 : 1);
			},
			
			'pr': function (a, b){
				var A = a.cells[1].innerText, B = b.cells[1].innerText;
				return A == B ? 0 : (A < B ? 1 : -1);
			},
			
			'c': function (a, b) {return (+b.cells[4].innerText) - (+a.cells[4].innerText);},
			
			'cr': function (a, b) {return (+a.cells[4].innerText) - (+b.cells[4].innerText);},
			
			'i': function (a, b) {return (+b.cells[5].innerText) - (+a.cells[5].innerText);},
			
			'ir': function (a, b) {return (+a.cells[5].innerText) - (+b.cells[5].innerText);},
			
			'a': function (a, b){
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return A == B ? 0 : (A < B ? -1 : 1);
			},
			
			'ar': function (a, b){
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return A == B ? 0 : (A < B ? 1 : -1);
			}
		}
	
	win.getSortChar = function (s) {return sortHook[s];}
	
	win.tableReverse = function () {Rows.reverse();}
	
	win.sortTable = function (order) {Rows.sort(sortFunc[order]);}
		
})(window ? window : this);
