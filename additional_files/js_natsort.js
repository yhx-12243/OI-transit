/*
    js_natsort.js - Natural Sort (natsort, natcasesort)
    Copyright (C) 2007  Ingo Volkmann
	Visit my site and get in contact with me at http://myinterests.de

    This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License 
	as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
	without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
	See the GNU General Public License for more details at http://www.gnu.org/licenses/gpl.html
*/

	var js_natsortLimit = 20;
	var js_natsortType = 1;

	function js_natcasesort(a, b) {
		var replaceArray = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_');
		
		a = a.toString();
		if (a.length > js_natsortLimit) a = a.substr(0, js_natsortLimit);
		a = a.replace(/\W/g, '_');
		var aArr = a.split('');
		for (var i = 0; i < replaceArray.length; ++i) {
			for (var k = 0; k < aArr.length; ++k) {
				if (!isInt(aArr[k]) && aArr[k].toLowerCase() === replaceArray[i]) {
					aArr[k] = i.toString();
				} else if (aArr[k] === replaceArray[i]) {
					aArr[k] = parseInt(i);
				}
			}
		}
		
		b = b.toString(); 
		if (b.length > js_natsortLimit) b = b.substr(0, js_natsortLimit);
		b = b.replace(/\W/g, '_');
		var bArr = b.split('');
		for (var i = 0; i < replaceArray.length; ++i) {
			for (var k = 0; k < bArr.length; ++k) {
				if (!isInt(bArr[k]) && bArr[k].toLowerCase() === replaceArray[i]) {
					bArr[k] = i.toString();
				} else if ( bArr[k] === replaceArray[i]) {
					bArr[k] = parseInt(i);
				}
			}
		}
		
		aArr = js_natsort_combineInt(aArr);
		bArr = js_natsort_combineInt(bArr);
		for (var i = 0; i < aArr.length; ++i) {
			if (aArr[i] !== bArr[i]) {
				if (typeof aArr[i] === typeof bArr[i]) {
					return aArr[i] < bArr[i] ? -1 : 1;
				} else {
					if (typeof aArr[i] === 'string' && typeof bArr[i] === 'number') return 1;
					if (typeof aArr[i] === 'number' && typeof bArr[i] === 'string') return -1;
				}
			}
		}
		
		return 0;
	}

	function js_natsort_combineInt(array) {
		for (var i = 0; i < array.length; ++i) {
			if (typeof array[i] === 'number' && typeof array[i + 1] === 'number'){
				var num = array[i].toString() + array[i + 1].toString();
				array[i] = parseInt(num);
				array.splice(i + 1, 1);
				js_natsort_combineInt(array);
				break;
			}
		}
		
		while (array.length < js_natsortLimit) void array.push('00');
		return array;
	}

	function isInt(x) {
		var y = parseInt(x);
		if (isNaN(y)) return false;
		return x == y && x.toString() === y.toString();
	} 
