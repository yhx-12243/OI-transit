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
			'soj' : [[/\d+/], 'http://10.49.18.71/problem/@0'],
			'cf' : [[/\d+/, /[A-Z]\d*/], 'https://codeforces.com/contest/@0/problem/@1'],
			'cc' : [[/\w+/], 'https://www.codechef.com/problems/@0/'],
			'spoj' : [[/\w+/], 'http://www.spoj.com/problems/@0/']
		},
		FLDict = {
			'Always' : '',
			'bestFy' : 'https://bestfy.cnblogs.com/',
			'_ChenKerui' : '',
			'daklqw' : 'https://daklqw.cnblogs.com/',
			'ddfsb' : '',
			'ddpag' : 'https://blog.zhangzisu.cn/#/',
			'des3ns1tized_' : 'https://www.karriganasta.xyz/',
			'lych_cys' : 'https://blog.csdn.net/lych_cys/',
			'lbn187' : '',
			'lyx_cjz' : '',
			'Memory_of_winter' : 'https://www.cnblogs.com/Memory-of-winter/',
			'miaom' : 'https://mioam.github.io/',
			'mrsrz' : 'https://mrsrz.cnblogs.com/',
			'nbdhhzh' : '',
			'qiqi20021026' : 'https://bomb-chicken.github.io/',
			'remember' : '',
			'shaochengxi' : 'https://scx117.cnblogs.com/',
			'skylee' : 'https://skylee03.cnblogs.com/',
			'wanglichao1121' : 'https://wanglichao1121.coding.me/',
			'weng_233' : '',
			'wzf2000' : 'https://wzf2000.zhzx-oier.top/'
		};

	persons = Object.keys(FLDict);
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

	win.htmlBalance = function (s, ch = '\x01') {
		return s.replace(/<([^"]*?"[^"]*?")*?[^"]*?>/g, function (w) {return ch.repeat(w.length);});
	}
	// a.htmlBalance=function(a,b='\x01'){return a.replace(/<([^"]*?"[^"]*?")*?[^"]*?>/g,function(w){return b.repeat(w.length);})}

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
		params['page'] = (p === 1 ? '' : p.toString());
		return getUri(params);
	}

	win.getTagUri = function (p) {
		var params = parseStr(location.search);
		params['tag'] = p;
		params['page'] = '';
		return getUri(params);
	}

	win.getDisplay = function (s) {return DisplayDict.hasOwnProperty(s) ? DisplayDict[s] : s;}

	win.getNorm = function (s) {return NormDict.hasOwnProperty(s) ? NormDict[s] : null;}

	win.getSite = function (s) {return SiteDict.hasOwnProperty(s) ? SiteDict[s] : null;}

	win.getFL = function (s) {return FLDict.hasOwnProperty(s) ? FLDict[s] : null;}

	win.pagination = function () {
		if (!(totPage > 1)) return;

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
			if (e.which === 13 || e.keyCode === 13) {
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
			if (e.target.nodeName.toLowerCase() === 'input') return;
			if (e.which === 37 || e.keyCode === 37) {
				if (curPage > 1) location.replace(getPageUri(curPage - 1));
			} else if (e.which === 39 || e.keyCode === 39) {
				if (curPage < totPage) location.replace(getPageUri(curPage + 1));
			}
		});
	}

	function OJMatch(s, pos) {
		var sOJ, sID, siteMethod, regSite, strSite, regResult, failed;
		sOJ = s.substr(0, pos); sID = s.substr(pos);
		if (siteMethod = getSite(sOJ)) {
			regSite = siteMethod[0]; 
			strSite = siteMethod[1];
			failed = false;
			for (var i in regSite) {
				regResult = sID.match(regSite[i]);
				if (regResult) strSite = strSite.replace("@" + i, regResult[0]);
				else return '';
			}
			return strSite;
		} else return '';		
	}

	win.recordMatch = function (info, location, config) {
		var i, j, l = 0, searchCount = 0, raw, OJ, srch = config['search'];
		var tmp, ret = [], html = [], link = [], _html = [], _link = [];
		if (location) {
			tmp = info[0].split(';');
			for (i in tmp)
				if (~(j = tmp[i].search(/[^a-z]/))) {
					OJ = tmp[i].substr(0, j);
					if (location === 'Unknown') j && !getNorm(OJ) && ret.push(tmp[i]);
					else if (location === 'Local') j || ret.push(tmp[i]);
					else getNorm(OJ) === location && ret.push(tmp[i]);
				}
		} else
			ret = info[0].split(';');
		if (!ret.length) return [];
		if (config['tag']) {
			tmp = ';' + html2Text(info[4]) + ';'
			if (!~tmp.indexOf(';' + config['tag'] + ';')) return [];
		}
		if (srch) l = config['search'].length;
		for (i in ret) {
			if (l && ~(j = ret[i].toUpperCase().indexOf(srch.toUpperCase()))) {
				++searchCount;
				html.push(
					ret[i].substr(0, j) + '<strong>' + ret[i].substr(j, l) + '</strong>' + ret[i].substr(j + l)
				);
			} else
				html.push(ret[i]);
			j = ret[i].search(/[^a-z]/);
			link.push(~j ? OJMatch(ret[i], j) : '');
		}
		tmp = info[4].split(';');
		for (i in tmp) {
			raw = html2Text(tmp[i]);
			if (l && ~(j = htmlBalance(tmp[i], '\x01').toUpperCase().indexOf(srch.toUpperCase()))) {
				++searchCount;
				_html.push(
					tmp[i].substr(0, j) + '<strong>' + tmp[i].substr(j, l) + '</strong>' + tmp[i].substr(j + l)
				);
			} else _html.push(tmp[i]);
			_link.push(getTagUri(raw));
		}
		if (l && !searchCount) return [];
		ret = [];
		tmp = [];
		for (i in html)
			tmp.push(link[i] ? '<a href="' + link[i] + '" target="_blank">' + html[i] + '</a>' : html[i]);
		ret[0] = tmp.join(';');
		tmp = [];
		for (i in _html)
			tmp.push('<a href="' + _link[i] + '">' + _html[i] + '</a>');
		ret[1] = tmp.join(';');
		return ret;
	}

})(window ? window : this);
