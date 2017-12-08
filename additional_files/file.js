var recarr, tearr, tetiarr, memarr;
var strBack, xmlBack, nowId;
var strFilter, pageO, pageC; // global

const RECORDS_PER_PAGE = 50, MEMOS_PER_PAGE = 50, failed = '今天运气不怎么好，和 scx 喝口茶再试试吧';

// ---------------- Records ---------------- //
function LoadRecordsTo(tar, jan){
	strBack = '';
	xhr.onreadystatechange = function (){
		if(xhr.readyState === 4){
			if(xhr.status === 200 || xhr.status === 0){
				strBack = xhr.responseText;
				DecRecords(tar, jan);
			}else
				alert(failed);
		}
	}
	xhr.open('GET', 'records/tot.cfg', true);
	xhr.send(null);
}

function DecRecords(tar, jan){
	var i, nm, info, count = 0, recnum = 0;
	var newRow, C0, C1, C2, C3, C4, C5, C6;
	recarr = strBack.split('\n');
	for(i in recarr)
		if(recarr[i]){
			info = recarr[i].replace(/[\f\n\r\v]/g, '').split('|');
			if(info.length !== 5) continue; // invalid record
			++recnum;
			nm = info[0];
			if(Matching(strFilter, nm)){
				newRow = tar.insertRow();
				C0 = newRow.insertCell();
				C0.innerHTML = (recnum - 1).toString()
				C1 = newRow.insertCell();
				C1.innerHTML = pr2HTML(nm);
				C2 = newRow.insertCell();
				C2.innerHTML = '<a href="records/' + escape(nm) + '.html" target="_blank">链接</a>';
				C3 = newRow.insertCell();
				C3.innerHTML = info[1];
				C4 = newRow.insertCell();
				C4.innerHTML = info[2];
				C5 = newRow.insertCell();
				C5.innerHTML = info[3];
				C6 = newRow.insertCell();
				C6.innerHTML = info[4];
				if(++count, count <= (pageO - 1) * RECORDS_PER_PAGE || pageO * RECORDS_PER_PAGE < count)
					newRow.style.display = 'none';
			}
		}
	for(i = 0; i < count; ++i){
		C0 = tar.rows[i].cells[0];
		C0.innerHTML = (recnum - parseInt(C0.innerHTML)).toString();
	}
	jan.innerHTML = 'scx: ' + (count ? (strFilter ? '当前筛选下共有 ' : '共做了 ') + count + ' 道题' : '怎么一道题都还没有啊，快点做题了！');
	pageC = Math.ceil(count / RECORDS_PER_PAGE);
	pageDeals();
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
