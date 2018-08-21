var
	curLocation, curPage, totPage, curROrder,
	Rows, tmpArr, titleArr;

const
	RECORDS_PER_PAGE = 50,
	MEMOS_PER_PAGE = 50;

(function (win, und){

	'use strict';

	var
		DisplayDict = {'': '全部', 'Luogu': '洛谷', 'SPOJ': 'Sphere OJ', 'SOJ': 'Simple OJ/Stupid OJ', 'Local': '本地', "Unknown": "这些题的 OJ 太高级了，连 scx 都不知道，快去问一问大佬们吧"},
		NormDict = {'lydsy': 'Lydsy', 'lg': 'Luogu', 'vijos': 'Vijos', 'hdu': 'HDU', 'poj': 'POJ', 'uoj': 'UOJ', 'loj': 'LibreOJ', 'simpleoj': 'SOJ', 'soj': 'SOJ', 'cf': 'Codeforces', 'cc': 'Codechef', 'spoj': 'SPOJ'},
		SiteDict = {
			'lydsy': [[/\d+/], 'https://www.lydsy.com/JudgeOnline/problem.php?id=@0'],
			'lg': [[/[TU]?\d+/], 'https://www.luogu.org/problemnew/show/@0'],
			'vijos': [[/^\d+/], 'https://vijos.org/p/@0'],
			'hdu': [[/\d+/], 'http://acm.hdu.edu.cn/showproblem.php?pid=@0'],
			'poj': [[/\d+/], 'http://poj.org/problem?id=@0'],
			'uoj': [[/\d+/], 'http://uoj.ac/problem/@0'],
			'loj': [[/\d+/], 'https://loj.ac/problem/@0'],
			'simpleoj': [[/\d+/], 'http://10.49.27.23/problem?id=@0'],
			'soj': [[/\d+/], 'http://61.153.16.137:8001/problem/@0'],
			'cf': [[/\d+/, /[A-Z]\d*/], 'http://codeforces.com/contest/@0/problem/@1'],
			'cc': [[/\w+/], 'https://www.codechef.com/problems/@0/'],
			'spoj': [[/\w+/], 'http://www.spoj.com/problems/@0/']
		};

	win.getStorage = localStorage.getItem.bind(localStorage);
	win.setStorage = localStorage.setItem.bind(localStorage);

	win.updTime = function (){
		var now = new Date(),
		year = now.getFullYear(),
		month = now.getMonth() + 1,
		day = now.getDate(),
		hour = now.getHours(),
		minute = now.getMinutes(),
		second = now.getSeconds();
		$('#dispTime').html('当前时间: ' + year + '-' + month + '-' + day + ' ' + hour + ':' +
		(minute < 10 ? '0' : '') + minute + ':' +
		(second < 10 ? '0' : '') + second);
	}

	win.parseSearch = function (key, defult){
		var reg = new RegExp('[?&]' + key + '=([^&]*)(&|$)'),
		r = win.location.search.match(reg);
		return r ? unescape(r[1]) : defult;
	}

	win.getDisplay = function (s) {return DisplayDict.hasOwnProperty(s) ? DisplayDict[s] : s;}

	win.getNorm = function (s) {return NormDict.hasOwnProperty(s) ? NormDict[s] : null;}

	win.getSite = function (s) {return SiteDict.hasOwnProperty(s) ? SiteDict[s] : null;}

	win.OJMatch = function (ptrn, s){
		var brr, i, j, ret = '', failed;
		var sOJ, sID, siteMethod, regSite, strSite, regResult;
		if(ptrn){
			brr = s.split(';');
			for(i in brr){
				if(j = brr[i].search(/[^a-z]/), j < 0) continue;
				sOJ = brr[i].substr(0, j);
				if(ptrn === 'Unknown') sOJ && !getNorm(sOJ) && (ret += brr[i] + ';');
				else if(ptrn === 'Local') !j && (ret += brr[i] + ';');
				else getNorm(sOJ) === ptrn && (ret += brr[i] + ';');
			}
			s = ret.substr(0, ret.length - 1); ret = '';
		}
		brr = s.split(';');
		for(i in brr){
			if(j = brr[i].search(/[^a-z]/), j <= 0) {ret += brr[i] + ';'; continue;}
			sOJ = brr[i].substr(0, j); sID = brr[i].substr(j);
			siteMethod = getSite(sOJ);
			if(!siteMethod) {ret += brr[i] + ";"; continue;}
			regSite = siteMethod[0]; 
			strSite = siteMethod[1];
			failed = false;
			for(j in regSite){
				regResult = sID.match(regSite[j]);
				if(!regResult) {failed = true; break;}
				strSite = strSite.replace("@" + j, regResult[0]);
			}
			if(failed) {ret += brr[i] + ";"; continue;}
			ret += '<a href="' + strSite + '" target="_blank">' + brr[i] + '</a>;';
		}
		return ret.substr(0, ret.length - 1);
	}
	
})(window ? window : this);
