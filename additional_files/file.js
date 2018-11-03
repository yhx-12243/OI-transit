(function (win, und) {

	'use strict';

	var
		recArr, memArr, okay, config = {};

	const
		failed = '今天运气不怎么好，码个动态仙人掌再试试吧';

	// ---------------- Configuration ---------------- //
	win.setFileConfig = function (key, val) {
		config[key] = val;
	}

	// ---------------- Records ---------------- //
	win.parseRecords = function (strBack) {
		var i, nm, info, count = 0, recnum = 0, tnm;
		var $R, $C, $A;
		Rows = []; recArr = strBack.split('\n');
		for (i = 0; i < recArr.length; ++i)
			if (recArr[i]) {
				info = recArr[i].replace(/[\f\n\r\v]/g, '').split('|');
				if (info.length !== 5) continue; // invalid record
				++recnum;
				if (!(tnm = OJMatch(curLocation, nm = info[0]))) continue;
				if (config['tag'] && !~(';' + html2Text(info[4]) + ';').indexOf(';' + config['tag'] + ';')) continue;
				$R = $('<tr />');
				$R.append($C = $('<td />').data('id', recnum - 1));
				$R.append($C = $('<td />').html(tnm));
				$A = $('<a href="records/' + encodeURIComponent(nm) + '.html" target="_blank">链接</a>');
				$R.append($C = $('<td />').append($A));
				$R.append($C = $('<td />').html(info[1]));
				$R.append($C = $('<td />').html(info[2]));
				$R.append($C = $('<td />').html(info[3]));
				$R.append($C = $('<td />').html(highlightTags(info[4])));
				Rows.push($R.get(0));
				++count;
			}
		for (i = 0; i < Rows.length; ++i) {
			$C = $(Rows[i].cells[0]);
			$C.html(recnum - $C.data('id')).removeData();
		}
		if (curROrder === 'nr') tableReverse();
		else if(curROrder !== 'n') sortTable(curROrder);
		totPage = Math.ceil(count / RECORDS_PER_PAGE);
		if (!(curPage >= 1)) curPage = 1;
		else if (curPage > totPage) curPage = totPage;
		$('#recTable').append(Rows.slice((curPage - 1) * RECORDS_PER_PAGE, curPage * RECORDS_PER_PAGE));
		$('#recTotal').html('统计：' + (count ? (curLocation || config['tag'] ? '当前位置' : '') + '共有 ' + count + ' 条记录' : '怎么一道题都还没有啊，快点做题了！'));
		pagination();
	}

	// ---------------- Templates ----------------- //
	win.getTemplates = function (strBack) {
		tmpArr = strBack.split('\n'); titleArr = []; okay = [];
		var i, t;
		for (i in tmpArr) {
			t = tmpArr[i] = tmpArr[i].replace(/[\f\n\r\v]/g, '');
			if (!t.length) return;
			$.ajax('templates/' + t + '.xml', {
				type: 'GET',
				dataType: 'xml',
				id: parseInt(i),
				success: parseTemplate
			});
		}
	}

	function parseTemplate(data) {
		var i = this.id, j, inner, $header, $text;
		titleArr[i] = $('title', data).text();
		$header = $('<h3 />').attr('id', tmpArr[i]).html(titleArr[i] + ' [#' + tmpArr[i] + ']:')
		inner = $('pre', data).prop('outerHTML');
		$text = $('<div />').html(inner).attr('data-id', i);
		for (j = i - 1; j >= 0; --j)
			if (okay[j]) break;
		$('#templates>div' + (~j ? '[data-id=' + j + ']' : '.cen')).after($text).after($header);
		okay[i] = true;
	}

	// ---------------- Memos ---------------- //
	win.parseMemos = function (strBack) {
		var i, j, nm, info, count = 0;
		var $R, $C, $A;
		Rows = []; memArr = strBack.split('\n');
		for (i = 0; i < memArr.length; ++i)
			if (memArr[i]) {
				info = memArr[i].replace(/[\f\n\r\v]/g, '').split('|');
				if(info.length !== 4) continue; // invalid memo
				nm = info[0];
				$R = $('<tr />');
				$R.append($C = $('<td />').data('id', i));
				$R.append($C = $('<td />').html(info[0]));
				$R.append($C = $('<td />'));
				$R.append($C = $('<td />').html(info[1]));
				$R.append($C = $('<td />').html(info[2]));
				$R.data('priority', parseInt(info[3]));
				Rows.push($R.get(0));
				++count;
			}
		for(i = 0; i < Rows.length; ++i){
			$C = $(Rows[i].cells[0]);
			$C.html(j = count - $C.data('id')).removeData();
			$C = $(Rows[i].cells[2]);
			$A = $('<a href="memos/' + j + '.html" target="_blank">链接</a>');
			$C.append($A);
		}
		Rows.sort(function(a, b) {return $(b).data('priority') - $(a).data('priority') || (+b.cells[0].innerText) - (+a.cells[0].innerText);});
		for(i = 0; i < Rows.length; ++i) $(Rows[i]).removeData();
		totPage = Math.ceil(count / RECORDS_PER_PAGE);
		if (!(curPage >= 1)) curPage = 1;
		else if (curPage > totPage) curPage = totPage;
		$('#memTable').append(Rows.slice((curPage - 1) * MEMOS_PER_PAGE, curPage * MEMOS_PER_PAGE));
		$('#memTotal').html('统计: 共 ' + count + ' 份便笺');
		pagination();
	}

	// ---------------- Ranklist ---------------- //
	win.parseRanklist = function (data) {
		var i, j, $R, $C, $A;
		if (data.status === 'OK') {
			data = data.result; Rows = [];
			for (i in data) {
				$R = $('<tr />');
				j = data[i].rating;
				$A = $('<a class="user ' +
					(j >= 3000 ? 'legendary' : j >= 2400 ? 'red' : j >= 2100 ? 'orange' : j >= 1900 ? 'violet' : j >= 1600 ? 'blue' : j >= 1400 ? 'cyan' : j >= 1200 ? 'green' : 'gray')
					+ '" href="http://codeforces.com/profile/' + data[i].handle + '" target="_blank">' + data[i].handle + '</a>');
				$R.append($C = $('<td />').append($A));
				$R.append($C = $('<td />').html(data[i].firstName));
				$R.append($C = $('<td />').html(data[i].lastName));
				$R.append($C = $('<td />').html(data[i].rating));
				$R.append($C = $('<td />').html(data[i].maxRating));
				j = new Date(data[i].lastOnlineTimeSeconds * 1e3);
				$R.append($C = $('<td />').html(dateFormat(j)));
				$A = ((j = getFL(data[i].handle)) ? $('<a href="' + j + '" target="_blank">' + j + '</a>') : null);
				$R.append($C = $('<td />').append($A));
				Rows.push($R.get(0));
			}
			$('#rankTable').append(Rows);
		}
	}

})(window ? window : this);
