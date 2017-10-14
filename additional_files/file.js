var xh, strBack, recarr;
var strFilter, pageO, pageC;

const RECORDS_PER_PAGE = 50;

function LoadFile(){
	strBack = "";
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok;
	xh.open("GET", "records/tot.cfg", true);
	xh.send(null);
}

function DecFile(){
	var i = 0, j = 0, nm = "", info, count = 0, recnum = 0;
	var newRow, C0, C1, C2, C3, C4, C5;
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
				C1.innerHTML = nm;
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
	for(i in recTable.rows)
		if(j = parseInt(i)){
			C0 = recTable.rows[j].cells[0];
			C0.innerHTML = (recnum - parseInt(C0.innerHTML)).toString();
		}
	if(count){
		if(strFilter === "") // all records
			recTotal.innerHTML = "scx: 共做了 " + count + " 道题";
		else // filtered
			recTotal.innerHTML = "scx: 当前筛选下共有 " + count + " 道题";
	}else // haven't done any problem (in thes filter)
		recTotal.innerHTML = "scx: 怎么一道题都还没有啊，快点做题了！";
	pageC = Math.ceil(count / RECORDS_PER_PAGE);
	pageDeals();
}

function read_ok(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			strBack = xh.responseText;
			DecFile();
		}else
			alert("今天运气不怎么好，和 scx 喝口茶再试试吧");
	}
}
