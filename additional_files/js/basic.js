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
			let local_ver = '7.1.1', prompt_str;
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
