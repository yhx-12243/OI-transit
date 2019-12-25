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
