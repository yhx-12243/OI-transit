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
