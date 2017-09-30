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
    var res = "当前时间：" + yr + "-" + mt + "-" + dy + " " + hr + ":" + mn + ":" + sc;
    v.innerHTML = res;
}

function getOJ(s){
	var t = s.substr(1), arr = t.split("&"), i, brr, res = "";
	for(i in arr){
		brr = arr[i].split("=");
		if(brr[0] === "selOJ"){
			if(brr.length > 1)
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
			if(brr.length > 1 && brr[1] !== "")
				res = brr[1];
			break;
		}
	}
	return res;
}

function getFull(s){
	switch(s){
		case "":
			return "全部";
		case "Luogu":
			return "洛谷";
		case "Local":
			return "本地测试";
		case "Unknown":
			return "这些题的 OJ 太高级了，连 scx 都不知道，快去问一问大佬们吧";
		default:
			return s;
	}
}

function testNorm(s){
	switch(s){
		case "lydsy":
			return "Lydsy";
		case "lg":
			return "Luogu";
		case "vijos":
			return "Vijos";
		case "hdu":
			return "HDU";
		case "poj":
			return "POJ";
		case "uoj":
			return "UOJ";
		case "loj":
			return "LibreOJ";
		case "simpleoj":
			return "SimpleOJ";
		case "cf":
			return "Codeforces";
		case "cc":
			return "Codechef";
		default:
			return "";
	}
}

function Matching(jF, pF){
	var brr, i = 0, j = 0, ls = "";
	if(jF === "") return true;
	brr = pF.split(";");
	for(i in brr){
		j = brr[i].search(/[^a-z]/);
		if(j < 0) continue;
		ls = brr[i].substr(0, j);
		if(jF === "Unknown"){
			if(j > 0 && testNorm(ls) === "") return true;
		}else if(jF === "Local"){
			if(j === 0) return true;
		}else
			if(testNorm(ls) === jF) return true;
	}
	return false;
}