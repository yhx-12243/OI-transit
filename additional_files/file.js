(function (win, und){
	
	'use strict';
	
	var
		tearr, tetiarr, memarr,
		strBack, xmlBack, nowId,
		recarr, recGoal, recFill;

	const
		failed = '今天运气不怎么好，和 scx 喝口茶再试试吧';

	// ---------------- Records ---------------- //
	win.LoadRecords = function (){
		strBack = '';
		recGoal = win.recTable.tBodies[0];
		recFill = win.recTotal;
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
		var R, C, A;
		Rows = []
		recarr = strBack.split('\n');
		for(i = 0; i < recarr.length; ++i)
			if(recarr[i]){
				info = recarr[i].replace(/[\f\n\r\v]/g, '').split('|');
				if(info.length !== 5) continue; // invalid record
				++recnum;
				nm = info[0];
				if(OJMatch(curLocation, nm)){
					R = $('<tr />');
					R.append(C = $('<td />').data('id', recnum - 1));
					R.append(C = $('<td />').html(pr2HTML(nm)));
					A = $('<a href="records/' + escape(nm) + '.html" target="_blank">链接</a>');
					R.append(C = $('<td />').append(A));
					R.append(C = $('<td />').html(info[1]));
					R.append(C = $('<td />').html(info[2]));
					R.append(C = $('<td />').html(info[3]));
					R.append(C = $('<td />').html(info[4]));
					if(++count, count <= (curPage - 1) * RECORDS_PER_PAGE || curPage * RECORDS_PER_PAGE < count)
						R.hide();
					Rows[count - 1] = R.get(0);
				}
			}
		for(i = 0; i < Rows.length; ++i){
			C = $(Rows[i].cells[0]);
			C.html(recnum - C.data('id')).removeData();
		}
		if(curROrder === 'nr') tableReverse();
		else if(curROrder !== 'n') sortTable(curROrder);
		$('#recTable').append(Rows);
		$('#recTotal').html('scx: ' + (count ? (curLocation ? '当前筛选下' : '') + '共有 ' + count + ' 条记录' : '怎么一道题都还没有啊，快点做题了！'));
		
		win.totPage = Math.ceil(count / RECORDS_PER_PAGE);
	}

	// ---------------- Templates ----------------- //
	function LoadTemplates(tar){
		strBack = '';
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					strBack = xhr.responseText;
					DecTemplate(); nowId = 0;
					OpenTemplate(tar);
				}else
					alert(failed);
			}
		}
		xhr.open('GET', 'templates/tot.cfg', true);
		xhr.send(null);
	}

	function DecTemplate(){
		var i;
		tearr = strBack.split('\n'); tetiarr = [];
		for(i in tearr)
			if(tearr[i])
				tearr[i] = tearr[i].replace(/[\f\n\r\v]/g, '');
	}

	function OpenTemplate(tar){
		if(nowId >= tearr.length) return;
		var f = tearr[nowId];
		if(!f) return;
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					xmlBack = xhr.responseXML;
					if(xmlBack) Analyze(tar);
					++nowId; OpenTemplate(tar);
				}else
					alert(failed);
			}
		}
		f = 'templates/' + f + '.xml';
		xhr.open('GET', f, true);
		xhr.send(null);
	}

	function Analyze(tar){
		var code, inner;
		var E0, E1;

		tetiarr[nowId] = xmlBack.getElementsByTagName('title')[0].childNodes[0].nodeValue;
		E0 = document.createElement('h3');
		E0.id = tearr[nowId];
		E0.innerHTML = tetiarr[nowId] + ' [#' + tearr[nowId] + ']：';
		templates.appendChild(E0);
		code = xmlBack.getElementsByTagName('pre')[0];
	
		if(code.innerXML) inner = code.innerXML;
		else if(code.xml) inner = code.xml;
		else inner = xs.serializeToString(code);
	
		E1 = document.createElement('div');
		E1.innerHTML = inner;
		tar.appendChild(E1);
	}

	// ---------------- Memos ---------------- //
	function LoadMemosTo(tar, jan){
		strBack = '';
		xhr.onreadystatechange = function (){
			if(xhr.readyState === 4){
				if(xhr.status === 200 || xhr.status === 0){
					strBack = xhr.responseText;
					DecMemos(tar, jan);
				}else
					alert(failed);
			}
		}
		xhr.open('GET', 'memos/tot.cfg', true);
		xhr.send(null);
	}

	function DecMemos(tar, jan){
		var i, nm, info, count = 0;
		var Rows = [], C0, C1, C2, C3, C4, C5, C6;
		memarr = strBack.split('\n');
		for(i in memarr)
			if(memarr[i] !== ''){
				info = memarr[i].replace(/[\f\n\r\v]/g, '').split('|');
				if(info.length !== 4) continue; // invalid memo
				nm = info[0];
				Rows[i] = document.createElement('tr');
				C0 = Rows[i].insertCell();
				C0.innerHTML = count.toString()
				C1 = Rows[i].insertCell();
				C1.innerHTML = info[0];
				C2 = Rows[i].insertCell();
				C3 = Rows[i].insertCell();
				C3.innerHTML = info[1];
				C4 = Rows[i].insertCell();
				C4.innerHTML = info[2];
				++count;
				if(count <= (pageO - 1) * MEMOS_PER_PAGE || pageO * MEMOS_PER_PAGE < count)
					Rows[i].style.display = 'none';
				Rows[i].priority = parseInt(info[3]);
			}
		for(i = 0; i < count; ++i){
			C0 = Rows[i].cells[0];
			C0.innerHTML = (j = count - parseInt(C0.innerHTML)).toString();
			C2 = Rows[i].cells[2];
			C2.innerHTML = '<a href="memos/' + j + '.html" target="_blank">链接</a>';
		}
		Rows.sort(function(a, b) {return b.priority - a.priority});
		for(i = 0; i < count; ++i) tar.appendChild(Rows[i]);
		jan.innerHTML = 'scx: 共 ' + count + ' 份便笺';
		pageC = Math.ceil(count / MEMOS_PER_PAGE);
		pageDeals();
	}
	
})(window ? window : this);
