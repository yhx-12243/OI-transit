(function (win, und){
	
	'use strict';
	
	var
		recArr, memArr,
		strBack, xmlBack, nowId, tFrag;

	const
		failed = '今天运气不怎么好，和 scx 喝口茶再试试吧';

	// ---------------- Records ---------------- //
	win.LoadRecords = function (){
		strBack = '';
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					strBack = xhr.responseText;
					DecRecords(); pageDeals();
				}else
					alert(failed);
			}
		}
		xhr.open('GET', 'records/tot.cfg', true);
		xhr.send(null);
	}

	function DecRecords(){
		var i, nm, info, count = 0, recnum = 0;
		var $R, $C, $A;
		Rows = []; recArr = strBack.split('\n');
		for(i = 0; i < recArr.length; ++i)
			if(recArr[i]){
				info = recArr[i].replace(/[\f\n\r\v]/g, '').split('|');
				if(info.length !== 5) continue; // invalid record
				++recnum;
				nm = info[0];
				if(OJMatch(curLocation, nm)){
					$R = $('<tr />');
					$R.append($C = $('<td />').data('id', recnum - 1));
					$R.append($C = $('<td />').html(pr2HTML(nm)));
					$A = $('<a href="records/' + escape(nm) + '.html" target="_blank">链接</a>');
					$R.append($C = $('<td />').append($A));
					$R.append($C = $('<td />').html(info[1]));
					$R.append($C = $('<td />').html(info[2]));
					$R.append($C = $('<td />').html(info[3]));
					$R.append($C = $('<td />').html(info[4]));
					Rows.push($R.get(0));
					++count;
				}
			}
		for(i = 0; i < Rows.length; ++i){
			$C = $(Rows[i].cells[0]);
			$C.html(recnum - $C.data('id')).removeData();
		}
		if(curROrder === 'nr') tableReverse();
		else if(curROrder !== 'n') sortTable(curROrder);
		$('#recTable').append(Rows.slice((curPage - 1) * RECORDS_PER_PAGE, curPage * RECORDS_PER_PAGE));
		$('#recTotal').html('scx: ' + (count ? (curLocation ? '当前筛选下' : '') + '共有 ' + count + ' 条记录' : '怎么一道题都还没有啊，快点做题了！'));
		win.totPage = Math.ceil(count / RECORDS_PER_PAGE);
	}

	// ---------------- Templates ----------------- //
	win.LoadTemplates = function (){
		strBack = '';
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					strBack = xhr.responseText;
					DecTemplate(); nowId = 0; tFrag = [];
					OpenTemplate();
				}else
					alert(failed);
			}
		}
		xhr.open('GET', 'templates/tot.cfg', true);
		xhr.send(null);
	}

	function DecTemplate(){
		var i;
		tmpArr = strBack.split('\n'); titleArr = [];
		for(i in tmpArr)
			tmpArr[i] = tmpArr[i] && tmpArr[i].replace(/[\f\n\r\v]/g, '');
	}

	function OpenTemplate(){
		if(nowId >= tmpArr.length) return $('#templates').append(tFrag), tFrag = [];
		var f = tmpArr[nowId];
		if(!f) return $('#templates').append(tFrag), tFrag = [];
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					xmlBack = xhr.responseXML;
					if(xmlBack) Analyze();
					++nowId; OpenTemplate();
				}else
					alert(failed);
			}
		}
		f = 'templates/' + f + '.xml';
		xhr.open('GET', f, true);
		xhr.send(null);
	}

	function Analyze(){
		var code, inner;
		var E0, E1;

		titleArr[nowId] = $('title', xmlBack).text();
		tFrag.push($('<h3 />').attr('id', tmpArr[nowId]).html(titleArr[nowId] + ' [#' + tmpArr[nowId] + ']:').get(0));
		
		inner = $('pre', xmlBack).prop('outerHTML');
		tFrag.push($('<div />').html(inner).get(0));
	}

	// ---------------- Memos ---------------- //
	window.LoadMemos = function (){
		strBack = '';
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					strBack = xhr.responseText;
					DecMemos(); //pageDeals();
				}else
					alert(failed);
			}
		}
		xhr.open('GET', 'memos/tot.cfg', true);
		xhr.send(null);
	}

	function DecMemos(){
		var i, j, nm, info, count = 0;
		var $R, $C, $A;
		Rows = []; memArr = strBack.split('\n');
		for(i = 0; i < memArr.length; ++i)
			if(memArr[i]){
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
		Rows.sort(function(a, b) {return $(b).data('priority') - $(a).data('priority');});
		for(i = 0; i < Rows.length; ++i) $(Rows[i]).removeData();
		$('#memTable').append(Rows.slice((curPage - 1) * MEMOS_PER_PAGE, curPage * MEMOS_PER_PAGE));
		$('#memTotal').html('scx: 共 ' + count + ' 份便笺');
		win.totPage = Math.ceil(count / RECORDS_PER_PAGE);
	}
	
})(window ? window : this);
