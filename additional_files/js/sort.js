(function (win, und) {

	"use strict";

	const
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

			n(a, b) {return (+b.cells[0].innerText) - (+a.cells[0].innerText);},

			nr(a, b) {return (+a.cells[0].innerText) - (+b.cells[0].innerText);},

			p(a, b) {return natcmp(a.cells[1].innerText, b.cells[1].innerText);},

			pr(a, b) {return -natcmp(a.cells[1].innerText, b.cells[1].innerText);},

			c(a, b) {return (+b.cells[4].innerText) - (+a.cells[4].innerText);},

			cr(a, b) {return (+a.cells[4].innerText) - (+b.cells[4].innerText);},

			i(a, b) {return (+b.cells[5].innerText) - (+a.cells[5].innerText);},

			ir(a, b) {return (+a.cells[5].innerText) - (+b.cells[5].innerText);},

			a(a, b) {return natcmp(a.cells[6].innerText, b.cells[6].innerText);},

			ar(a, b) {return -natcmp(a.cells[6].innerText, b.cells[6].innerText);},

			Ru(a, b) {
				let A = trim(a.cells[0].innerText.toLowerCase()), B = trim(b.cells[0].innerText.toLowerCase());
				return A < B ? -1 : A > B ? 1 : 0;
			},

			Rf(a, b) {
				let A = a.cells[1].innerText.toLowerCase(), B = b.cells[1].innerText.toLowerCase();
				return A < B ? -1 : A > B ? 1 : sortFunc.Ru(a, b);
			},

			Rl(a, b) {
				let A = a.cells[2].innerText.toLowerCase(), B = b.cells[2].innerText.toLowerCase();
				return A < B ? -1 : A > B ? 1 : sortFunc.Ru(a, b);
			},

			Rr(a, b) {return (+b.cells[3].innerText) - (+a.cells[3].innerText);},

			Rm(a, b) {return (+b.cells[4].innerText) - (+a.cells[4].innerText);},

			Rt(a, b) {return new Date(b.cells[5].innerText) - new Date(a.cells[5].innerText);},

			Rb(a, b) {
				let A = a.cells[6].innerText, B = b.cells[6].innerText;
				return A < B ? -1 : A > B ? 1 : sortFunc.Ru(a, b);
			}
		}

	function trim(x) {return x.substring(x.search(/[a-z]/));}

	win.natcmp = function (a, b) {
		let digitA, digitB, posA, posB, u, v;
		if (a === b) return 0;
		for (; ; ) {
			digitA = ('0' <= a[0] && a[0] <= '9');
			digitB = ('0' <= b[0] && b[0] <= '9');
			if (digitA ^ digitB) return digitB - digitA;
			if (digitA) {
				posA = a.search(/[^\d]/), posA = (~posA ? posA : a.length);
				posB = b.search(/[^\d]/), posB = (~posB ? posB : b.length);
				if (posA != posB) return posA - posB;
			} else {
				posA = a.search(/\d/), posA = (~posA ? posA : a.length);
				posB = b.search(/\d/), posB = (~posB ? posB : b.length);
			}
			u = a.substr(0, posA), v = b.substr(0, posB);
			if (u != v) return u < v ? -1 : 1;
			a = a.substr(posA), b = b.substr(posB);
		}
	}

	win.getSortChar = function (s) {return sortHook[s];}

	win.getSortChar2 = function (s) {return sortHook2[s];}

	win.tableReverse = function () {Rows.reverse();}

	win.sortTable = function (order) {Rows.sort(function (a, b) {
		let A = a.cells[0].children.length, B = b.cells[0].children.length;
		return A === B ? sortFunc[order](a, b) : B - A;
	});}

})(window ? window : this);
