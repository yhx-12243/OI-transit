var xh, strBack, strFilter, arr;

function LoadFile(){
	strBack = "";
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok;
	xh.open("GET", "records/tot.cfg", true);
	xh.send(null);
}

function DecFile(){
	var i = 0, j = 0, nm = "", brr, cnt = 0;
	var newRow, C0, C1, C2, C3, C4, C5;
	arr = strBack.split("\n");
	for(i in arr)
		if(arr[i] !== ""){
			brr = arr[i].replace(/[\f\n\r\v]/g, "").split("/");
			if(brr.length !== 5) continue;
			nm = brr[0];
			newRow = recTable.insertRow();
			C0 = newRow.insertCell();
			C0.className = "bd_table";
			C0.innerHTML = nm;
			C1 = newRow.insertCell();
			C1.className = "bd_table";
			C1.innerHTML = "<a href=\"records/" + nm + ".html\" target=\"_blank\">链接</a>";
			C2 = newRow.insertCell();
			C2.className = "bd_table";
			C2.innerHTML = brr[1];
			C3 = newRow.insertCell();
			C3.className = "bd_table";
			C3.innerHTML = brr[2];
			C4 = newRow.insertCell();
			C4.className = "bd_table";
			C4.innerHTML = brr[3];
			C5 = newRow.insertCell();
			C5.className = "bd_table";
			C5.innerHTML = brr[4];
			if(Matching(strFilter, nm)){
				++cnt;
			}else{
				newRow.style.display = "none";
			}
		}
	if(!cnt) // haven't done any problem
		recTotal.innerHTML = "scx: 怎么一道题都还没有啊，快点做题了！";
	else
		if(strFilter === "")
			recTotal.innerHTML = "scx: 共做了 " + cnt + " 道题";
		else
			recTotal.innerHTML = "scx: 当前筛选下共有 " + cnt + " 道题";
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
