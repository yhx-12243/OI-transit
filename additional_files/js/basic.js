var
	curLocation, curPage, totPage, curROrder,
	Rows, tmpArr, titleT, persons;

const
	RECORDS_PER_PAGE = 50,
	MEMOS_PER_PAGE = 50;

(function (win, $, und) {

	'use strict';

	const
		DisplayDict = {'Luogu' : '洛谷', 'SPOJ' : 'Sphere OJ', 'SOJ' : 'Simple OJ/Stupid OJ', 'Local' : '本地', 'Unknown' : '一些看似不是很知名的 OJ，快去问一问大佬们吧'},
		NormDict = {'lydsy' : 'Lydsy', 'lg' : 'Luogu', 'vijos' : 'Vijos', 'hdu' : 'HDU', 'poj' : 'POJ', 'uoj' : 'UOJ', 'loj' : 'LibreOJ', 'simpleoj' : 'SOJ', 'soj' : 'SOJ', 'cf' : 'Codeforces', 'gym' : 'Codeforces', 'cc' : 'Codechef', 'ac' : 'AtCoder', 'agc' : 'AtCoder', 'arc' : 'AtCoder', 'abc' : 'AtCoder', 'spoj' : 'SPOJ'},
		SiteDict = {
			'lydsy' : [/^(\d+)$/, x => `https://www.lydsy.com/JudgeOnline/problem.php?id=${x}`],
			'lg' : [/^([TU]?)(\d+)$/, (x, y) => `https://www.luogu.com.cn/problem/${x || 'P'}${y}`],
			'vijos' : [/^(\d+)$/, x => `https://vijos.org/p/${x}`],
			'hdu' : [/^(\d+)$/, x => `http://acm.hdu.edu.cn/showproblem.php?pid=${x}`],
			'poj' : [/^(\d+)$/, x => `http://poj.org/problem?id=${x}`],
			'uoj' : [/^(\d+)$/, x => `http://uoj.ac/problem/${x}`],
			'loj' : [/^(\d+)$/, x => `https://loj.ac/problem/${x}`],
			'simpleoj' : [/^(\d+)$/, x => `http://10.49.27.23/problem?id=${x}`],
			'soj' : [/^(\d+)$/, x => `http://10.49.18.71/problem/${x}`],
			'cf' : [/^(\d+)([A-Z]\d*)$/, (x, y) => `https://codeforces.com/contest/${x}/problem/${y}`],
			'gym' : [/^(\d+)([A-Z]\d*)$/, (x, y) => `https://codeforces.com/gym/${x}/problem/${y}`],
			'cc' : [/^(\w+)$/, x => `https://www.codechef.com/problems/${x}/`],
			'ac' : [/^(\d+)$/, getAtCoderID],
			'agc' : [/^(\d+)([A-Z])$/, (x, y) => `https://atcoder.jp/contests/agc${x}/tasks/agc${x}_${char_offset(y, 32)}`],
			'arc' : [/^(\d+)([A-Z])$/, (x, y) => `https://atcoder.jp/contests/arc${x}/tasks/arc${x}_${char_offset(y, 30)}`],
			'abc' : [/^(\d+)([A-Z])$/, (x, y) => `https://atcoder.jp/contests/abc${x}/tasks/abc${x}_${char_offset(y, 32)}`],
			'spoj' : [/^(\w+)$/, x => `http://www.spoj.com/problems/${x}/`]
		},
		FLDict = {
			'Always' : '',
			'bestFy' : 'https://bestfy.cnblogs.com/',
			'_ChenKerui' : '',
			'daklqw' : 'https://daklqw.cnblogs.com/',
			'ddfsb' : '',
			'ddpag' : '',
			'des3ns1tized_' : '',
			'lbn187' : '',
			'lych_cys' : 'https://blog.csdn.net/lych_cys/',
			'lyx_cjz' : '',
			'Memory_of_winter' : 'https://www.cnblogs.com/Memory-of-winter/',
			'memset0c' : 'https://memset0.cn/',
			'miaom' : 'https://mioam.github.io/',
			'mrsrz' : 'https://mrsrz.github.io/',
			'nbdhhzh' : '',
			'ouuan' : 'https://ouuan.github.io/',
			'qiqi20021026' : 'https://bomb-chicken.github.io/',
			'remember' : '',
			'shaochengxi' : 'https://scx117.cnblogs.com/',
			'skylee' : 'https://skylee03.cnblogs.com/',
			'suncongbo' : 'https://www.cnblogs.com/suncongbo/',
			'wanglichao1121' : 'https://wanglichao1121.coding.me/',
			'weng_233' : '',
			'wzf2000' : 'https://wzf2000.top/'
		};

	let
		AtCoderIDDict;

	persons = Object.keys(FLDict);
	win.getStorage = localStorage.getItem.bind(localStorage);
	win.setStorage = localStorage.setItem.bind(localStorage);

	win.dateFormat = function (date) {
		let m = date.getMinutes(), s = date.getSeconds();
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
	}

	win.updTime = function () {$('#dispTime').html('当前时间: ' + dateFormat(new Date()));}

	win.htmlspecialchars = function (s) {return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');}

	win.htmlspecialcharsDecode = function (s) {return s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');}

	win.stripTags = function (s) {return s.replace(/<([^"]*?"[^"]*?")*?[^"]*?>/g, '');}

	win.html2Text = function (s) {return htmlspecialcharsDecode(stripTags(s));}

	win.htmlBalance = function (s, ch = '\x01') {return s.replace(/<([^"]*?"[^"]*?")*?[^"]*?>/g, x => ch.repeat(x.length));}

	win.parseStr = function (s) {
		let ret = {}, t, r;
		for (t of (s.startsWith('?') ? s.substr(1) : s).split('&'))
			if (r = t.split('='), r[1])
				ret[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
		return ret;
	}

	win.queryStringEncode = function (params) {return Object.keys(params).sort().filter(x => params[x]).map(x => encodeURIComponent(x) + '=' + encodeURIComponent(params[x])).join('&');}

	win.getUri = function (params) {
		let ps = queryStringEncode(params);
		return location.href.replace(/[?#].*/, '') + (ps ? '?' + ps : '');
	}

	win.getPageUri = function (p) {
		let params = parseStr(location.search);
		params['page'] = (p === 1 ? '' : p.toString());
		return getUri(params);
	}

	win.getTagUri = function (p) {
		let params = parseStr(location.search);
		params['tag'] = p, params['page'] = '', params['from'] = '';
		return getUri(params);
	}

	win.getDisplay = function (s) {return DisplayDict.hasOwnProperty(s) ? DisplayDict[s] : s;}

	win.getNorm = function (s) {return NormDict.hasOwnProperty(s) ? NormDict[s] : null;}

	win.getSite = function (s) {return SiteDict.hasOwnProperty(s) ? SiteDict[s] : null;}

	win.getFL = function (s) {return FLDict.hasOwnProperty(s) ? FLDict[s] : null;}

	win.pagination = function () {
		if (totPage > 1) {
			let $pag = $('#pagination'), $sel, i;
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
				if (i === curPage) {
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
					let p = parseInt(this.value);
					if (1 <= p && p <= totPage) location.href = getPageUri(p);
					else alert('你都输入的些什么呀，认真点！');
				}
			}).blur(function () {
				let p = parseInt(this.value);
				if (p === curPage) ;
				else if (1 <= p && p <= totPage) location.href = getPageUri(p);
				else this.value = curPage.toString();
			});
	
			$(document).keyup(function (e) {
				if (e.target.nodeName.toUpperCase() === 'INPUT') return;
				if (e.which === 37 || e.keyCode === 37) {
					if (curPage > 1) location.href = getPageUri(curPage - 1);
				} else if (e.which === 39 || e.keyCode === 39) {
					if (curPage < totPage) location.href = getPageUri(curPage + 1);
				}
			});
		}
	}

	win.initPage = function () {
		updTime(), setInterval(updTime, 250);
		if (getStorage('marquee') === 'on') {
			$("#intro").show().get(0).start();
			$('#ctrl-marquee>.hint').html('关闭字幕');
		}
		
		$('#ctrl-marquee').click(function () {
			let $mar = $('#intro'), $tip = $('#ctrl-marquee>.hint');
			setStorage('marquee', $mar.is(':hidden') ? ($mar.show().get(0).start(), $tip.html('关闭字幕'), 'on') : ($mar.hide(), $tip.html('开启字幕'), 'off'));
		});

		$('#ctrl-export').click(function () {
			if (!Rows) return alert('导出失败：本页面无表格');
			let r, table, csv;
			for (r of Rows)
				if (r.parentNode) table = r.parentNode.parentNode;
			if (!table) return alert('导出失败：无法找到表格行所对应的表格');
			csv = [Array.prototype.map.call(table.tHead.children[0].children, x => '"' + x.innerText + '"').join(',') + '\n'];
			for (r of Rows) {
				csv.push(Array.prototype.map.call(r.children, x => x.innerText === '链接' ? '"' + x.children[0].href + '"' : $.isNumeric(x.innerText) ? x.innerText : '"' + x.innerText.trim() + '"').join(',') + '\n');
			}
			r = URL.createObjectURL(new Blob(csv, {type: 'text/csv, charset=utf-8'}));
			$('<a href="' + r + '" download="export.csv"></a>').get(0).click();
			URL.revokeObjectURL(r);
		});

		$('#motto').fadeTo(2000, 1, function () {$(this).css('opacity', '');});
	}

	function char_offset(x, y) {return String.fromCharCode(x.charCodeAt() + y);}

	function make_ac_link() {
		const data = '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';
		AtCoderIDDict = RawDeflate.inflate(atob(data)).split('|').map(x => {
			let l, r;
			if (~x.indexOf('#')) {
				[l, r] = x.split('#');
			} else if (~x.indexOf('>')) {
				[l, r] = x.split('>'), r = l + '_' + r;
			} else return '';
			return `https://atcoder.jp/contests/${l}/tasks/${r}`;
		});
	}

	function getAtCoderID(id) {
		if (AtCoderIDDict === und) make_ac_link();
		return AtCoderIDDict[id] || '';
	}

	function OJMatch(s, pos) {
		let site = getSite(s.substr(0, pos)), result;
		return site && (result = s.substr(pos).match(site[0])) ? site[1].apply(null, result.slice(1)) : '';
	}

	win.recordMatch = function (info, location, config) {
		let i, j, l = 0, searchCount = 0, srch = config['search'], ret = [], html = [], link = [], _html = [], _link = [];
		// 1. check location
		if (location) {
			for (i of info[0].split(';'))
				if (~(j = i.search(/[^a-z]/))) {
					let OJ = i.substr(0, j);
					if (location === 'Unknown') j && !getNorm(OJ) && ret.push(i);
					else if (location === 'Local') j || ret.push(i);
					else getNorm(OJ) === location && ret.push(i);
				}
		} else 
			ret = info[0].split(';');
		if (!ret.length) return [];
		// 2. check tag
		if (config['tag'] && !~(';' + html2Text(info[4]) + ';').indexOf(';' + config['tag'] + ';')) return [];
		// 3. check search
		if (srch) l = config['search'].length;
		for (i of ret) {
			if (srch && ~(j = i.toUpperCase().indexOf(srch.toUpperCase())))
				++searchCount,
				html.push(
					i.substr(0, j) + '<strong>' + i.substr(j, l) + '</strong>' + i.substr(j + l)
				);
			else
				html.push(i);
			j = i.search(/[^a-z]/);
			link.push(~j ? OJMatch(i, j) : '');
		}
		for (i of info[4].split(';')) {
			let raw = html2Text(i);
			if (srch && ~(j = htmlBalance(i).toUpperCase().indexOf(srch.toUpperCase())))
				++searchCount,
				_html.push(
					i.substr(0, j) + '<strong>' + i.substr(j, l) + '</strong>' + i.substr(j + l)
				);
			else _html.push(i);
			_link.push(getTagUri(raw));
		}
		ret = [srch && srch === info[5] ? (++searchCount, '<strong>' + info[5] + '</strong>') : info[5]];
		if (srch && !searchCount) return [];
		// 4. totalize (joining)
		ret.push(html.map((x, i) => link[i] ? '<a href="' + link[i] + '" target="_blank">' + x + '</a>' : x).join(';'));
		ret.push(_html.map((x, i) => '<a href="' + _link[i] + '">' + x + '</a>').join(';'));
		return ret;
	}

})(window ? window : this, jQuery);
