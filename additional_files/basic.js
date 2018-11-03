var
	curLocation, curPage, totPage, curROrder,
	Rows, tmpArr, titleArr, persons;

const
	RECORDS_PER_PAGE = 50,
	MEMOS_PER_PAGE = 50;

(function (win, und) {

	'use strict';

	var
		DisplayDict = {'Luogu' : '洛谷', 'SPOJ' : 'Sphere OJ', 'SOJ' : 'Simple OJ/Stupid OJ', 'Local' : '本地', 'Unknown' : '一些看似不是很知名的 OJ，快去问一问大佬们吧'},
		NormDict = {'lydsy' : 'Lydsy', 'lg' : 'Luogu', 'vijos' : 'Vijos', 'hdu' : 'HDU', 'poj' : 'POJ', 'uoj' : 'UOJ', 'loj' : 'LibreOJ', 'simpleoj' : 'SOJ', 'soj' : 'SOJ', 'cf' : 'Codeforces', 'cc' : 'Codechef', 'spoj' : 'SPOJ'},
		SiteDict = {
			'lydsy' : [[/\d+/], 'https://www.lydsy.com/JudgeOnline/problem.php?id=@0'],
			'lg' : [[/[TU]?\d+/], 'https://www.luogu.org/problemnew/show/@0'],
			'vijos' : [[/^\d+/], 'https://vijos.org/p/@0'],
			'hdu' : [[/\d+/], 'http://acm.hdu.edu.cn/showproblem.php?pid=@0'],
			'poj' : [[/\d+/], 'http://poj.org/problem?id=@0'],
			'uoj' : [[/\d+/], 'http://uoj.ac/problem/@0'],
			'loj' : [[/\d+/], 'https://loj.ac/problem/@0'],
			'simpleoj' : [[/\d+/], 'http://10.49.27.23/problem?id=@0'],
			'soj' : [[/\d+/], 'http://61.153.16.137:8001/problem/@0'],
			'cf' : [[/\d+/, /[A-Z]\d*/], 'https://codeforces.com/contest/@0/problem/@1'],
			'cc' : [[/\w+/], 'https://www.codechef.com/problems/@0/'],
			'spoj' : [[/\w+/], 'http://www.spoj.com/problems/@0/']
		},
		FLDict = {
			'bestFy' : 'https://bestfy.cnblogs.com/',
			'daklqw' : 'https://daklqw.cnblogs.com/',
			'lych_cys' : 'https://blog.csdn.net/lych_cys/',
			'miaom' : 'https://mioam.github.io/',
			'mrsrz' : 'https://mrsrz.cnblogs.com/',
			'qiqi20021026' : 'https://bomb-chicken.github.io/',
			'shaochengxi' : 'https://scx117.cnblogs.com/',
			'skylee' : 'https://skylee03.cnblogs.com/',
			'wanglichao1121' : 'https://wanglichao1121.coding.me/',
			'Wonderrr' : 'https://www.karriganasta.xyz/',
			'wzf2000' : 'https://wzf2000.zhzx-oier.top/',
			'ZhangZisu' : 'https://blog.zhangzisu.cn/#/' 
		};

	persons = ['bestFy', '_ChenKerui', 'daklqw', 'ddpag', 'lbn187', 'lych_cys', 'lyx_cjz', 'miaom', 'mrsrz', 'nbdhhzh', 'qiqi20021026', 'shaochengxi', 'skylee', 'twinkle_', 'wanglichao1121', 'Wonderrr', 'wzf2000', 'ZhangZisu'];
	win.getStorage = localStorage.getItem.bind(localStorage);
	win.setStorage = localStorage.setItem.bind(localStorage);

	win.dateFormat = function(date) {
		var year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();
		return year + '-' + month + '-' + day + ' ' + hour + ':' + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
	}

	win.updTime = function () {$('#dispTime').html('当前时间: ' + dateFormat(new Date()));}

	win.htmlspecialchars = function (s) {return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');}

	win.htmlspecialcharsDecode = function (s) {return s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');}

	win.stripTags = function (s) {return s.replace(/<([^"]*?"[^"]*?")*?[^"]*?>/g, '');}

	win.html2Text = function (s) {return htmlspecialcharsDecode(stripTags(s));}

	win.parseStr = function (s) {
		var ret = {}, i, a, b;
		if (s.startsWith('?')) s = s.substr(1);
		a = s.split('&');
		for (i in a)
			if (b = a[i].split('='), b[1])
				ret[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
		return ret;
	}

	win.queryStringEncode = function (params) {
		var ret = [];
		Object.keys(params).sort().forEach(function (item) {
			if (params[item])
				ret.push(encodeURIComponent(item) + '=' + encodeURIComponent(params[item]));
		});
		return ret.join('&');
	}

	win.getUri = function (params) {
		var ps = queryStringEncode(params);
		return location.href.replace(/\?.*/, '') + (ps ? '?' + ps : '');
	}

	win.getPageUri = function (p) {
		var params = parseStr(location.search);
		params['page'] = (p == 1 ? '' : p.toString());
		return getUri(params);
	}

	win.getDisplay = function (s) {return DisplayDict.hasOwnProperty(s) ? DisplayDict[s] : s;}

	win.getNorm = function (s) {return NormDict.hasOwnProperty(s) ? NormDict[s] : null;}

	win.getSite = function (s) {return SiteDict.hasOwnProperty(s) ? SiteDict[s] : null;}

	win.getFL = function (s) {return FLDict.hasOwnProperty(s) ? FLDict[s] : null;}

	win.pagination = function () {
		if (totPage <= 1) return;

		var $pag = $('#pagination'), $sel, i;
		if (curPage > 1) {
			$pag.append($('<li />')
				.html('<a href="' + getPageUri(1) + '">&laquo;</a>')
			).append($('<li />')
				.html('<a href="' + getPageUri(curPage - 1) + '">&lt;</a>')
			);
		} else {
			$pag.append($('<li class="disabled">')
				.html('<a>&laquo;</a>')
			).append($('<li class="disabled">')
				.html('<a>&lt;</a>')
			);
		}

		for (i = Math.max(curPage - 4, 1); i <= Math.min(curPage + 4, totPage); ++i) {
			if (i == curPage) {
				$pag.append($('<li />')
					.append(
						$sel = $('<input type="number" id="selPage" class="cen" min="1" max="' + totPage.toString()+ '" value="' + curPage.toString() + '" />')
					)
				);
			} else {
				$pag.append($('<li />')
					.html('<a href="' + getPageUri(i) + '">' + i + '</a>')
				);
			}
		}

		if (curPage < totPage) {
			$pag.append($('<li />')
				.html('<a href="' + getPageUri(curPage + 1) + '">&gt;</a>')
			).append($('<li />')
				.html('<a href="' + getPageUri(totPage) + '">&raquo;</a>')
			);
		} else {
			$pag.append($('<li class="disabled">')
				.html('<a>&gt;</a>')
			).append($('<li class="disabled">')
				.html('<a>&raquo;</a>')
			);
		}

		if (!$sel) return;

		$sel.keypress(function (e) {
			if (e.which === 13 || e.keyCode === 13){
				var p = parseInt(this.value);
				if (p < 1 || p > totPage) alert('你都输入的些什么呀，认真点！');
				else location.replace(getPageUri(p));
			}
		}).blur(function () {
			var p = parseInt(this.value);
			if (p < 1 || p > totPage) this.value = curPage.toString();
			else if (p !== curPage) location.replace(getPageUri(p));
		});
		
		$(document).keyup(function (e) {
			if (e.target.id === 'selPage') return;
			if (e.which === 37 || e.keyCode === 37) {
				if (curPage > 1) location.replace(getPageUri(curPage - 1));
			} else if (e.which === 39 || e.keyCode === 39) {
				if (curPage < totPage) location.replace(getPageUri(curPage + 1));
			}
		});
	}

	win.OJMatch = function (ptrn, s) {
		var brr, i, j, ret = '', failed;
		var sOJ, sID, siteMethod, regSite, strSite, regResult;
		if (ptrn) {
			brr = s.split(';');
			for (i in brr){
				if (j = brr[i].search(/[^a-z]/), j < 0) continue;
				sOJ = brr[i].substr(0, j);
				if (ptrn === 'Unknown') sOJ && !getNorm(sOJ) && (ret += brr[i] + ';');
				else if(ptrn === 'Local') !j && (ret += brr[i] + ';');
				else getNorm(sOJ) === ptrn && (ret += brr[i] + ';');
			}
			s = ret.substr(0, ret.length - 1); ret = '';
		}
		brr = s.split(';');
		for (i in brr) {
			if (j = brr[i].search(/[^a-z]/), j <= 0) {ret += brr[i] + ';'; continue;}
			sOJ = brr[i].substr(0, j); sID = brr[i].substr(j);
			siteMethod = getSite(sOJ);
			if (!siteMethod) {ret += brr[i] + ";"; continue;}
			regSite = siteMethod[0]; 
			strSite = siteMethod[1];
			failed = false;
			for (j in regSite) {
				regResult = sID.match(regSite[j]);
				if (!regResult) {failed = true; break;}
				strSite = strSite.replace("@" + j, regResult[0]);
			}
			if (failed) {ret += brr[i] + ";"; continue;}
			ret += '<a href="' + strSite + '" target="_blank">' + brr[i] + '</a>;';
		}
		return ret.substr(0, ret.length - 1);
	}

	win.highlightTags = function (s) {
		var brr = s.split(';'), i, ret = '', tag;
		for (i in brr) {
			tag = html2Text(brr[i]);
			var params = parseStr(location.search);
			params['tag'] = tag;
			params['page'] = '';
			ret += '<a href="' + getUri(params) + '">' + brr[i] + '</a>;';
		}
		return ret.substr(0, ret.length - 1);
	}

})(window ? window : this);
