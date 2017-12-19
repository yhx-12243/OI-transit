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
			
			'n': function (a, b){
				return (+b.cells[0].innerText) - (+a.cells[0].innerText);
			},
			
			'p': function (a, b){
				var A = a.cells[1].innerText, B = b.cells[1].innerText;
				return A == B ? 0 : (A < B ? -1 : 1);
			},
			
			'c': function (a, b){
				return (+a.cells[4].innerText) - (+b.cells[4].innerText);
			},
			
			'i': function (a, b){
				return (+a.cells[5].innerText) - (+b.cells[5].innerText);
			},
			
			'a': function (a, b){
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return A == B ? 0 : (A < B ? -1 : 1);
			}
			
		}
	
	win.getSortChar = function (s) {return sortHook[s];}
	
	win.tableReverse = function (){
		Rows.reverse();
		Showing();
	}
	
	win.sortTable = function (order){
		Rows.sort(sortFunc[order]);
		Showing();
	}
	
	function Showing(){
		var i;
		for(i = 0; i < Rows.length; ++i)
			$(Rows[i]).toggle((curPage - 1) * RECORDS_PER_PAGE <= i && i < curPage * RECORDS_PER_PAGE);
	}
		
})(window ? window : this);
