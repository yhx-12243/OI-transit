function displaytime(v){
    var now = new Date()
    var yr = now.getFullYear();
    var mt = now.getMonth() + 1;
    var dy = now.getDate();
    var hr = now.getHours();
    var mn = now.getMinutes();
    var sc = now.getSeconds();
    mn = mn < 10 ? "0" + mn : mn;
    sc = sc < 10 ? "0" + sc : sc;
    var res = "当前时间：" + yr + "-" + mt + "-" + dy + "  " + hr + ":" + mn + ":" + sc;
    v.innerHTML = res;
}

function getOJ(s){
	var t = s.substr(1), arr = t.split("&"), i, brr, res = "";
	for(i in arr){
		brr = arr[i].split("=");
		if(brr[0] === "selOJ"){
			res = brr[1];
			break;
		}
	}
	return res;
}

function getPage(s){
	var t = s.substr(1), arr = t.split("&"), i, brr, res = "1";
	for(i in arr){
		brr = arr[i].split("=");
		if(brr[0] === "page"){
			if(brr[1] !== "")
				res = brr[1];
			break;
		}
	}
	return res;
}

function getShort(s){
	switch(s){
		case "Lydsy":
			return "lydsy";
		case "Luogu":
			return "lg";
		case "Vijos":
			return "vijos"
		case "HDU":
			return "hdu"
		case "POJ":
			return "poj"
		case "LibreOJ":
			return "loj"
		case "SimpleOJ":
			return "simpleoj"
		case "Codeforces":
			return "cf"
		case "UVa":
			return "uva"
		default:
			return "unknown"
	}
}
	
function getFull(s){
	switch(s){
		case "":
			return "全部";
		case "Luogu":
			return "洛谷";
		case "Unknown":
			return "这些题的 OJ 太高级了，连 scx 都不知道，快去问一问大佬们吧";
		default:
			return s;
	}
}
