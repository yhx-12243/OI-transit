var xh, strBack, strFilter, arr;

function LoadFile(){
	strBack = "";
	xh = new XMLHttpRequest();
	xh.onreadystatechange = read_ok;
	xh.open("GET", "records/tot.cfg", true);
	xh.send(null);
}

function DecFile(){
	var i, j = 0, brr, nm = "", newRow, C0, C1, C2, C3, C4;
	arr = strBack.split("\n");
	for(i in arr)
		if(arr[i] !== ""){
			brr = arr[i].split("/");
			nm = brr[0];
			j = nm.toUpperCase().lastIndexOf(".HTML");
			if(brr.length === 4 && j === nm.length - 5){
				newRow = recTable.insertRow();
				C0 = newRow.insertCell();
				C0.className = "bd_table";
				C0.innerHTML = nm.substr(0, j);
				C1 = newRow.insertCell();
				C1.className = "bd_table";
				C1.innerHTML = "<a href=\"records/" + nm + "\" target=\"blank\">链接</a>";
				C2 = newRow.insertCell();
				C2.className = "bd_table";
				C2.innerHTML = brr[1];
				C3 = newRow.insertCell();
				C3.className = "bd_table";
				C3.innerHTML = brr[2];
				C4 = newRow.insertCell();
				C4.className = "bd_table";
				C4.innerHTML = brr[3];
			}
		}
}

function read_ok(){
	if(xh.readyState === 4){
		if(xh.status === 200 || xh.status === 0){
			strBack = xh.responseText;
			DecFile();
		}else
			alert("ä»Šå¤©è¿æ°”ä¸å¤ªå¥½ï¼Œå’Œ scx å–å£èŒ¶å†æ¥è¯•è¯•å§");
	}
}
