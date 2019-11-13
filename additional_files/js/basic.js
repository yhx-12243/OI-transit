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
			'lg' : [/^([TU]?)(\d+)$/, (x, y) => `https://www.luogu.org/problem/${x || 'P'}${y}`],
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
			'wzf2000' : 'https://wzf2000.zhzx-oier.top/'
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
		return location.href.replace(/\?.*/, '') + (ps ? '?' + ps : '');
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
