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
			'lydsy' : [/^(\d+)$/, x => `https://darkbzoj.tk/problem/${x}`],
			'lg' : [/^([TU]?)(\d+)$/, (x, y) => `https://www.luogu.com.cn/problem/${x || 'P'}${y}`],
			'vijos' : [/^(\d+)$/, x => `https://vijos.org/p/${x}`],
			'hdu' : [/^(\d+)$/, x => `http://acm.hdu.edu.cn/showproblem.php?pid=${x}`],
			'poj' : [/^(\d+)$/, x => `http://poj.org/problem?id=${x}`],
			'uoj' : [/^(\d+)$/, x => `https://uoj.ac/problem/${x}`],
			'loj' : [/^(\d+)$/, x => `https://loj.ac/p/${x}`],
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
			'ig-Rookie' : '',
			'ig-TheShy' : 'https://www.cnblogs.com/xuanyiming/',
			'lbn187' : '',
			'lych_cys' : 'https://blog.csdn.net/lych_cys/',
			'lyx_cjz' : '',
			'Memory_of_winter' : 'https://www.cnblogs.com/Memory-of-winter/',
			'memset0c' : 'https://memset0.cn/',
			'miaom' : '',
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
			'TOMCATa' : '',
			'wanglichao1121' : '',
			'weng_233' : '',
			'weng_weijie' : '',
			'wzf2000' : 'https://wzf2000.top/'
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
			let local_ver = '7.4.11', prompt_str;
			$.ajax('https://yhx-12243.github.io/OI-transit/additional_files/others/version', {
				type : 'GET',
				cache : false,
				success : ver => {
					if (natcmp(local_ver, ver = ver.trim()) < 0) {
						prompt_str = 'Warning: 当前 OI-transit 版本 (' + local_ver + ') 非最新版本 (' + ver + ')，请前往 https://github.com/yhx-12243/OI-transit 获取最新版。';
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
