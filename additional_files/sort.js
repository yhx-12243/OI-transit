(function (win, und) {

	"use strict";

	var
		sortHook = 'np ncia', sortHook2 = 'uflrmtb',
		// Natural order
		// Problem-id order
		// Concept-difficulty order
		// Implementation-difficulty order
		// Algorithm order
		// Username
		// First-name
		// Last-name
		// Rating
		// Max-rating
		// last-online-Time
		// personal-Blog-link
		sortFunc = {

			'n': function (a, b) {return (+b.cells[0].innerText) - (+a.cells[0].innerText);},

			'nr': function (a, b) {return (+a.cells[0].innerText) - (+b.cells[0].innerText);},

			'p': function (a, b) {
				var A = a.cells[1].innerText, B = b.cells[1].innerText;
				return js_natcasesort(A, B);
			},

			'pr': function (a, b) {
				var A = a.cells[1].innerText, B = b.cells[1].innerText;
				return -js_natcasesort(A, B);
			},

			'c': function (a, b) {return (+b.cells[4].innerText) - (+a.cells[4].innerText);},

			'cr': function (a, b) {return (+a.cells[4].innerText) - (+b.cells[4].innerText);},

			'i': function (a, b) {return (+b.cells[5].innerText) - (+a.cells[5].innerText);},

			'ir': function (a, b) {return (+a.cells[5].innerText) - (+b.cells[5].innerText);},

			'a': function (a, b) {
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return js_natcasesort(A, B);
			},

			'ar': function (a, b) {
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return -js_natcasesort(A, B);
			},

			'Ru': function (a, b) {
				var A = trim(a.cells[0].innerText.toLowerCase()), B = trim(b.cells[0].innerText.toLowerCase());
				return A < B ? -1 : A == B ? 0 : 1;
			},

			'Rf': function (a, b) {
				var A = a.cells[1].innerText.toLowerCase(), B = b.cells[1].innerText.toLowerCase();
				return A < B ? -1 : A == B ? sortFunc.Ru(a, b) : 1;
			},

			'Rl': function (a, b) {
				var A = a.cells[2].innerText.toLowerCase(), B = b.cells[2].innerText.toLowerCase();
				return A < B ? -1 : A == B ? sortFunc.Ru(a, b) : 1;
			},

			'Rr': function (a, b) {return (+b.cells[3].innerText) - (+a.cells[3].innerText);},

			'Rm': function (a, b) {return (+b.cells[4].innerText) - (+a.cells[4].innerText);},

			'Rt': function (a, b) {return new Date(b.cells[5].innerText) - new Date(a.cells[5].innerText);},

			'Rb': function (a, b) {
				var A = a.cells[6].innerText, B = b.cells[6].innerText;
				return A < B ? -1 : A == B ? sortFunc.Ru(a, b) : 1;
			}
		}

	function trim(x) {var a = x.search(/[a-z]/); return ~a ? x.substr(a) : x;}

	win.getSortChar = function (s) {return sortHook[s];}

	win.getSortChar2 = function (s) {return sortHook2[s];}

	win.tableReverse = function () {Rows.reverse();}

	win.sortTable = function (order) {Rows.sort(sortFunc[order]);}

})(window ? window : this);
