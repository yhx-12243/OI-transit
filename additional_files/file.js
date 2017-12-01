var xh, xs, recarr, tearr, tetiarr, memarr;
var strBack, xmlBack;
var strFilter, pageO, pageC, nowId;

const RECORDS_PER_PAGE = 50, MEMOS_PER_PAGE = 50;

const failed = "今天运气不怎么好，和 scx 喝口茶再试试吧";

function LoadRecords(){
	strBack = "";
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok1;
	xh.open("GET", "records/tot.cfg", true);
	xh.send(null);
}

function DecRecords(){
	var i = 0, nm = "", info, count = 0, recnum = 0;
	var newRow, C0, C1, C2, C3, C4, C5, C6;
	recarr = strBack.split("\n");
	for(i in recarr)
		if(recarr[i] !== ""){
			info = recarr[i].replace(/[\f\n\r\v]/g, "").split("|");
			if(info.length !== 5) continue; // invalid record
			++recnum;
			nm = info[0];
			if(Matching(strFilter, nm)){
				newRow = recTable.tBodies[0].insertRow();
				C0 = newRow.insertCell();
				C0.innerHTML = (recnum - 1).toString()
				C1 = newRow.insertCell();
				C1.innerHTML = prToHTML(nm);
				C2 = newRow.insertCell();
				C2.innerHTML = "<a href=\"records/" + nm.replace(/#/g, "%23") + ".html\" target=\"_blank\">链接</a>";
				C3 = newRow.insertCell();
				C3.innerHTML = info[1];
				C4 = newRow.insertCell();
				C4.innerHTML = info[2];
				C5 = newRow.insertCell();
				C5.innerHTML = info[3];
				C6 = newRow.insertCell();
				C6.innerHTML = info[4];
				++count;
				if(count <= (pageO - 1) * RECORDS_PER_PAGE || pageO * RECORDS_PER_PAGE < count)
					newRow.style.display = "none";
			}
		}
	for(i = 0; i < count; ++i){
		C0 = recTable.tBodies[0].rows[i].cells[0];
		C0.innerHTML = (recnum - parseInt(C0.innerHTML)).toString();
	}
	if(count)
		if(strFilter === "") // all records
			recTotal.innerHTML = "scx: 共做了 " + count + " 道题";
		else // filtered
			recTotal.innerHTML = "scx: 当前筛选下共有 " + count + " 道题";
	else // haven't done any problem (in thes filter)
		recTotal.innerHTML = "scx: 怎么一道题都还没有啊，快点做题了！";
	pageC = Math.ceil(count / RECORDS_PER_PAGE);
	pageDeals();
}

function LoadTemplates(){
	strBack = "";
	xs = new XMLSerializer();
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok2;
	xh.open("GET", "templates/tot.cfg", true);
	xh.send(null);
}

function DecTemplate(){
	var i, info = "", filename = "";
	tearr = strBack.split("\n"); tetiarr = []
	for(i in tearr)
		if(tearr[i] != "")
			tearr[i] = tearr[i].replace(/[\f\n\r\v]/g, "");
}

function OpenTemplate(){
	if(nowId >= tearr.length) return;
	var f = tearr[nowId];
	if(f === "") return;
	// xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok3;
	f = "templates/" + f + ".xml";
	xh.open("GET", f, true);
	xh.send(null);
}

function Analyze(){
	var code, inner;
	var E0, E1;

	tetiarr[nowId] = xmlBack.getElementsByTagName("title")[0].childNodes[0].nodeValue;
	E0 = document.createElement("h3");
	E0.id = tearr[nowId];
	E0.innerHTML = tetiarr[nowId] + " [#" + tearr[nowId] + "]：";
	templates.appendChild(E0);
	code = xmlBack.getElementsByTagName("pre")[0];
	
	if(code.innerXML) inner = code.innerXML;
	else if(code.xml) inner = code.xml;
	else
		// xs = new XMLSerializer();
		inner = xs.serializeToString(code);
	
	E1 = document.createElement("div");
	E1.innerHTML = inner;
	templates.appendChild(E1);
}

function LoadMemos(){
	strBack = "";
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok4;
	xh.open("GET", "memos/tot.cfg", true);
	xh.send(null);
}

function DecMemos(){
	var i = 0, j = 0, nm = "", info, count = 0;
	var Rows = [], C0, C1, C2, C3, C4, C5, C6;
	memarr = strBack.split("\n");
	for(i in memarr)
		if(memarr[i] !== ""){
			info = memarr[i].replace(/[\f\n\r\v]/g, "").split("|");
			if(info.length !== 4) continue; // invalid memo
			nm = info[0];
			Rows[i] = document.createElement("tr");
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
				Rows[i].style.display = "none";
			Rows[i].priority = parseInt(info[3]);
		}
	for(i = 0; i < count; ++i){
		C0 = Rows[i].cells[0];
		C0.innerHTML = (j = count - parseInt(C0.innerHTML)).toString();
		C2 = Rows[i].cells[2];
		C2.innerHTML = "<a href=\"memos/" + j + ".html\" target=\"_blank\">链接</a>";
	}
	Rows.sort(function(a, b) {return b.priority - a.priority});
	for(i = 0; i < count; ++i)
		memTable.tBodies[0].appendChild(Rows[i]);
	memTotal.innerHTML = "scx: 共 " + count + " 份便笺";
	pageC = Math.ceil(count / RECORDS_PER_PAGE);
	pageDeals();
}

function read_ok1(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			strBack = xh.responseText;
			DecRecords();
		}else
			alert(failed);
	}
}

function read_ok2(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			strBack = xh.responseText;
			DecTemplate();
			nowId = 0; OpenTemplate();
		}else
			alert(failed);
	}
}

function read_ok3(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			xmlBack = xh.responseXML;
			if(xmlBack) Analyze();
			++nowId; OpenTemplate();
		}else
			alert(failed);
	}
}

function read_ok4(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			strBack = xh.responseText;
			DecMemos();
		}else
			alert(failed);
	}
}
