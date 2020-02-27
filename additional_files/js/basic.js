var
	curLocation, curPage, totPage, curROrder,
	Rows, tmpArr, titleT, persons;

const
	RECORDS_PER_PAGE = 50,
	MEMOS_PER_PAGE = 50;

(function (win, $, und) {

	'use strict';

	win.getStorage = localStorage.getItem.bind(localStorage);
	win.setStorage = localStorage.setItem.bind(localStorage);

	let
		AtCoderIDDict,
		codeforces_flag = getStorage('codeforces-portal') === 'in-problemset',
		atcoder_flag = getStorage('atcoder-portal') === 'minor';

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
			'cf' : [/^(\d+)([A-Z]\d*)$/, codeforces_flag ? (x, y) => `https://codeforces.com/problemset/problem/${x}/${y}` : (x, y) => `https://codeforces.com/contest/${x}/problem/${y}`],
			'gym' : [/^(\d+)([A-Z]\d*)$/, (x, y) => `https://codeforces.com/gym/${x}/problem/${y}`],
			'cc' : [/^(\w+)$/, x => `https://www.codechef.com/problems/${x}/`],
			'ac' : [/^(\d+)$/, getAtCoderID],
			'agc' : [/^(\d+)([A-Z])$/, atcoder_flag ? (x, y) => `https://agc${x}.contest.atcoder.jp/tasks/agc${x}_${char_offset(y, 32)}` : (x, y) => `https://atcoder.jp/contests/agc${x}/tasks/agc${x}_${char_offset(y, 32)}`],
			'arc' : [/^(\d+)([A-Z])$/, atcoder_flag ? (x, y) => `https://arc${x}.contest.atcoder.jp/tasks/arc${x}_${char_offset(y, 30)}` : (x, y) => `https://atcoder.jp/contests/arc${x}/tasks/arc${x}_${char_offset(y, 30)}`],
			'abc' : [/^(\d+)([A-Z])$/, atcoder_flag ? (x, y) => `https://abc${x}.contest.atcoder.jp/tasks/abc${x}_${char_offset(y, 32)}` : (x, y) => `https://atcoder.jp/contests/abc${x}/tasks/abc${x}_${char_offset(y, 32)}`],
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
			'msuwakow' : 'https://www.cnblogs.com/suwakow/',
			'nbdhhzh' : '',
			'ouuan' : 'https://ouuan.github.io/',
			'qiqi20021026' : 'https://bomb-chicken.github.io/',
			'remember' : '',
			'shaochengxi' : 'https://scx117.cnblogs.com/',
			'skip1978' : 'https://www.cnblogs.com/skip1978/',
			'skip2004' : '',
			'skylee' : 'https://skylee03.cnblogs.com/',
			'StudyingFather' : 'https://studyingfather.com/',
			'suncongbo' : 'https://www.cnblogs.com/suncongbo/',
			'wanglichao1121' : 'https://wanglichao1121.coding.me/',
			'weng_233' : '',
			'weng_weijie' : '',
			'wzf2000' : 'https://wzf2000.top/',
			'xpptsdy' : '',
			'xymtxdy' : 'https://www.cnblogs.com/xuanyiming/'
		};

	persons = Object.keys(FLDict);

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

			for (i of getPageList(curPage, totPage, getStorage('pagination'))) {
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

		if (getStorage('check-version') !== 'off') {
			let local_ver = '7.1', prompt_str;
			$.ajax('https://yhx-12243.github.io/OI-transit/additional_files/others/version', {
				type : 'GET',
				cache : false,
				success : ver => {
					if (natcmp(local_ver, ver = ver.trim()) < 0) {
						prompt_str = 'Warning: 当前 OI-transit 版本 (' + local_ver + ') 非最新版本 (' + ver + ')，请去 https://github.com/yhx-12243/OI-transit 获取最新版。';
						console.log(prompt_str);
						if (confirm(prompt_str + '\n    (点击确定进入 GitHub，点击取消不再提醒)')) {
							win.open('https://github.com/yhx-12243/OI-transit');
						} else {
							alert('Tip: 版本检查可以在「小工具」中「更多设置」里重新打开。');
							setStorage('check-version', 'off');
							$('#status-check-version').html('off').css('color', '#09f');
							$('#toggle-check-version').html('开启');
						}
					}
				}
			});
		}
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
			return atcoder_flag ? `https://${l}.contest.atcoder.jp/tasks/${r}` : `https://atcoder.jp/contests/${l}/tasks/${r}`;
		});
	}

	function getAtCoderID(id) {
		if (AtCoderIDDict === und) make_ac_link();
		return AtCoderIDDict[id] || '';
	}

	function getPageList(x, n, type) {
		let i, ret = [];
		switch (type) {
			case 'doubling':
				ret = [x];
				for (i = 2; i <= x; i <<= 1) ret.unshift(x - i + 1);
				if (ret[0] !== 1) ret.unshift(1);
				for (i = 2; i <= n - x + 1; i <<= 1) ret.push(x + i - 1);
				if (ret[ret.length - 1] !== n) ret.push(n);
				break;
			case 'binary':
				ret = [x];
				for (i = x - 1; i > 0; i &= i - 1) ret.unshift(i);
				if (ret[0] !== 1) ret.unshift(1);
				for (i = (x === 1 ? (ret.push(2), 3) : x + 1); i <= n; i |= i - 1, ++i) ret.push(i);
				if (ret[ret.length - 1] !== n) ret.push(n);
				break;
			default:
				for (i = Math.max(x - 4, 1); i <= Math.min(x + 4, totPage); ++i) ret.push(i);
				break;
		}
		return ret;
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
