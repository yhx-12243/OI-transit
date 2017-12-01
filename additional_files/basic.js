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
		case "SPOJ":
			return "Sphere OJ"
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
		case "spoj":
			return "SPOJ";
		default:
			return "";
	}
}

function getSite(s){
	switch(s){
		case "lydsy":
			return [[/\d+/], "http://www.lydsy.com/JudgeOnline/problem.php?id=@0"];
		case "lg":
			return [[/[TU]?\d+/], "https://www.luogu.org/problemnew/show/@0"];
		case "hdu":
			return [[/\d+/], "http://acm.hdu.edu.cn/showproblem.php?pid=@0"];
		case "poj":
			return [[/\d+/], "http://poj.org/problem?id=@0"];
		case "uoj":
			return [[/\d+/], "http://uoj.ac/problem/@0"];
		case "loj":
			return [[/\d+/], "https://loj.ac/problem/@0"];
		case "simpleoj":
			return [[/\d+/], "http://10.49.27.23/problem?id=@0"];
		case "cf":
			return [[/\d+/, /[A-G]\d*/], "http://codeforces.com/contest/@0/problem/@1"];
		case "cc":
			return [[/\w+/], "https://www.codechef.com/problems/@0/"];
		case "spoj":
			return [[/\w+/], "http://www.spoj.com/problems/@0/"];
		default:
			return null;
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

function prToHTML(pr){
	var brr, i = 0, j = 0, ret = "", failed = false;
	var sOJ = "", sID = "", siteMethod, regSite, strSite, regResult;
	brr = pr.split(";");
	for(i in brr){
		j = brr[i].search(/[^a-z]/);
		if(j <= 0) {ret += brr[i] + ";"; continue;}
		sOJ = brr[i].substr(0, j);
		sID = brr[i].substr(j);
		siteMethod = getSite(sOJ);
		if(siteMethod === null) {ret += brr[i] + ";"; continue;}
		regSite = siteMethod[0]; 
		strSite = siteMethod[1];
		failed = false;
		for(j in regSite){
			regResult = sID.match(regSite[j]);
			if(regResult === null) {failed = true; break;}
			strSite = strSite.replace("@" + j, regResult[0]);
		}
		if(failed) {ret += brr[i] + ";"; continue;}
		ret += "<a href=\"" + strSite + "\" target=\"_blank\">" + brr[i] + "</a>;";
	}
	return ret.substr(0, ret.length - 1);
}
