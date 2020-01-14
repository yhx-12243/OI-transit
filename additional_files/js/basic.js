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
		const data = 'vF1Lj6u6lv4xNS6p8IMkk5J630FLPWi1utWDHkXYGHBe5EBy9q6r/Pjm9WEDhphEuntwavlb3/IL48daJufxmPl3v10l+QqC78CIxIjUiMyI3IihETdG3BpxZxXxZclWeQHpqxMV8uurrkwnEAgUAnvoQ2NHrsVHLe7r/0zAa6HPKov+GRXxRFfexVmXpc4vE9XfUaGji1RtaQQVIagIQUVIVZH63yHXZZXD1+a7lHmhrHQSyVteWMA5Op2spLjrU6xtA1Wco5udY3Syk9ElSovIAor8frNLlLqQ90GOWii7Bid9UaWVvkbyqC8TICVTiE4hNoV4D22/ZX4+69tNKQsrM6VuVjo53a3URZ9sssxUdKsytSChTrZ5Xug0Oms7w6Lq9frB2rmm2e0c2VBx15fSSt9+rlk+MFIn1eQTODDiwKgDYw7MdNDuu1R/3VU91izoFp2vpQVcf4qqgbGFRCK+D5tYYfHfqrjpUp3V5WbhMr/cVGkjN1UUuhqWP3ahR22lTnmaW8lYl7dCi/uoRJnl1/Km5bEc1r4ofvblsc89+Pq+5uXNDMIKKNUlzY93G7lFuigtILqe7qWwgPgSWalCpVVtbINEX6KTDWQ6VqVSR7sUfS7yKA6mEJlCdAqxKcQtaNTXTR3S7Hdk98UpOiq7a0731FQ6+BbR5WJ1VfAdF1Fqur0CKul2G1DSuyrtPI7qR1Zzng2VmW6eubZzVlJfM1VYr1eFFuqaFzcLuCd5MEySYZIOk2yY5FYyul5PatDaPD9W88EpsTCd25WsqlyNZzWsJekmTmuWqrBEl5mVrKR9cooGVvUDk1FZzyjBDE5mcDqDsxmcW3g1LqoX4HSK7Deowov8FpnZu25C1fX3i9rX5GGDj9EljYo8t6AyP+YisvOTWT25q0HJ159rVSEb05e/9a2tCpa+z6Bd+qKLPtcv0Rgv9amaXSbwrYj0pa5nv2xTrJYUqyXFakmr1fL3vc2gYvUiMSI1osXlRgwfyf0Y8Y/6v3uhL7eiWlosSBYq1jcbqVbLaybvt4cNVjN/NTcUA6i428mT/uteTbkWUt7TvKjnrEy0lfmohX0wSpNRmo7SrO0Mhn5i6CeGfmLW9uaTdNubcz7BztE/1QSs392qYY/jHXuaqiArQewEtROsT1gWFt9i21xuxNCIGyNujbiziviy5OBh2kEHA5FMFGlWrSUTNMsv9bzb9B9H13J0LUfX8u+u+0NwQnBCcMJuUzf5d1OXYxR8NsX+dY9O//bRIvsa2TdINRp8WMSLRb1Y1aMgV/mpovLno5aq7fFeBS6QuEDqAp158hbMqoWlB7PABRIXSF0gc4F80u5fg3Y/04dP9Jsn+q3rYf9jQNk90Vej+wkheEbohuUGA3Xz3SMUAhtk0ux/Bpk0yD7yYgkvlvRixV6sZknKr+pSY/Ijuup8L/PYBR/u3Y54hFc7+uYE1/THFl21RVdt0VXbuXfa/tcwd8hkh0x2yGRXTx732/182SfVZPP9FQyTZJikw+TIlg+T4TC5GSa3w+RukKzG2iBZ7WuitO6jFv3Qsp0qO1K0rBbLarmsjpfValmdLKvTZXX2WNYfltXHR6zTalt0iopb2SzXVrqa15e0ZFFLbR8LqYeNkYklU0tmlswtObTkjSVvLXlnZONsIZazhdTOlmZLdYk/6r/7r2CUHuvpKM1GaT5Kh6P0ZpTejtK79vWrzkMBBAKBQmCPn3sWfcot/aiFfSXUNXeAxAVSF+jMkz9e/9fUFc6rAM6rAM6rxofWCPArBfArBfArNRusarKrHhXN8o9eClwgcYHUBTrz5G+1E7v9ALv9ALv9gKKd2OkG2OkG2OkG7NscnuhnHP0EH32yWgpOjb/EOgU5OOfz/aLl8Fw1odUnwZELYsIR9/KW30cEMiirOsMVQ7fLlHWOSpnfynlCef0ZKqldhu0bmGiPeTWjzKvP+f1yi/SocsxmqLJ2vIy7waZci+r8eBk3gA0aEElVZrpakP+V//7j3/69Lv5/rrUjAJM3LZtktagtqsWyWi6r42W1WlYny+p0WZ0tq/Wy+oAzFv2OjCiMKI0YG1EZMTFiasTMiNqIVmnHR6ry6oXpirYSwk5IOxGPDlm02RVH1saRdkeeyIslvFjSixV7sdSEJSasX47au1jCiyW9WLEXSz2ELm5Z9bZ/sdr9OkyKYVIOk/EwOcoqGSb/PG7xVfa+0iaRRmfVSpf7uY5XNHI9IV+ixp/dpI+X6FpG8timYi07m1KdtfpzbRMn9UfLvHH7VAvDqQVFHXZpJP1bd+VHXa6ND6mVoiJVHapUZ1C7vqs1qJGz/F523LTQMaSqqFZMtMgvkZS6b2JVirq0y9MpuqT3KFWfdbM//1ZF8FFL9Zk3WlKKJaVcUsZLSrWkTJaU6WA8jY931HHsnGcJL5b0YsVeLPU4R3/0+X7+lPdrQ/3ogJYVPdGLJ3r5RB8/0T+rX/JEnz7RZ0/0+oke5yha3s9nVXz+jopz9YLcr2b1aRT7TvG/1/7MucJErDeR603i9SZqvUmy3iRdb5KtN9HrTQ6PSCA6LxCdF110fphbs/EdZVRjk+EwSxS+ROlLjH2JypeY+BLTKZE6iNTVPW6i8CVKX2LsS1S+xMSX6N09mS9R+xIPvsSjL/E0JTIHkbmetZsofInSlxj7EpUvMfElpr7EzJeofYn9/NV5JxAsChAsChAsChAsChAsChAsChAsCupgUVfy0K1IR+7WGbVYVstldbysVsvqZFmdLquzZbVeVnePgWAZIVhGGh+Y6O5WVTtvefypOJ1AIFAIPYc//lvJ4q5vn/9V1Jv/ern67I4Yn9fmQpBUH0XLUXv4Oqrn85qdaGtJ0QCKBlA0gA5iDs1oQTAnQDAnQDAn2GCwIYoRIIoRIIoR1FGMJmuGUhlKZSiVgcPB4eBwcDhq1uSKiEeAiEeAiEew6ypF4JYlcMsSuGXJl7kTSC3fNrV829TybVPLt00t3za1fNvU8m1Ty7dNLd82tXzb1PJt09q33TpF2NApwka+ohm1WFbLZXW8rFbL6mRZnS6rs2W1XlYfHn+13htWHf17URhRGjE2ojJiYsTUiFk75kIMxxDDMcRwDDHK4DUn8JoTeM0J5msCrzmB15zAa04IOPBKE3ilCbzSBF5pAq80gVeawCtNGDhYGwjWBoK1geAVahqwQdua1/pWT14fbXpPoejeyi2oW3TDFt2wtbPcgbcDbwfersurjZUIxEoEYiWii5U0AvbpAfbpbSBCIBAhEIgQCEQIBCLEIBDB+qABM4GIAUhcIHWBzjx5B5IeJKagAUhcIHWBzAXydt4jWNUJVnWCVZ30IxITNsGETTBhE0zYBBM2wYRNMGGTLTiYYwnmWII5lmCOpZhjKeZYijmWfpkLN8x4cpnx5DLjyWXGk8uMJ5cZTy4znlxmPLnMeHKZ8eSy76MRT66rMGziDWUOL+08S3ixpBcr9mKpCUtMWL8ctXexhBdLerFiL9aw9o1H67O+FDGgTh1wT6jCnyr9qbE/VT3qmx+fSV6c76fIfoA1vu/w4fBaayFWW8jVFvGMhZix+DXbjnkLsdpCrrZwtaN1qE4tMNrWWojVFnK1xfp2qNUWyWqLdLVFu4sKcNwIcNwIcNxo4+0C8XaBeLtAvF108fZGwOEgwOEgwOGgPfUKnHoFTr0Cp17RnXrbD1+aMx4bnvHY6Og7oxbLarmsjpfValmdLKvTZXW2rNbL6sOyGj4m5vAnMpcX9SlR+BKlLzH2JSpfYuJLTH2JmS9R+xIPUyJzEJnrybiJwpcofYmxL1H5EhNfYupLzHyJ2pd46OZTVd7039UmY7JQd4rR1sGTLtbR5Tp6PEcXDvqv+bq76WIdXa6jO+teqFP0M6I3mLvu83Sxji7X0VfWXa2jJ+vo6Tp6to6u19EPj8eRXWV90Kz/iPaPbP/E7R/V/knaP+33P45CrD3/sKThnnGNjXjBRr5gE79go16wSV6wSV+wyV6w0S/YOOfic17Un4m1X5QMrTrVvla5B4SvsXjHWL5jHC8ZNx+3uI3PKl4u+Intq+XWqpcLbozjuTde/cm00PV9p5G5Ubifso+hMKXesuhyLEd5RNawbAkmm+5oG6H01zMQ72Yg380gfjcD9W4GybsZpO9mkC1kIJ5nIBbHgVcG4t0M5LsZxO9moN7NIHk3g/TdDJzrWv0ddORaoxqFewJ6YiNesJEv2MQv2KgXbJIXbNIXbF55PvoFm0MbKkEMkSKGSBFDpIghUsQQKWKIFDFESqyg/X/+3z+qgvnH5ac+cPJ9MEHIBKEThE0QPkHCCbKZINsJspvW8GsKTWsdTKsddI49RDLbCwoCFxREd0Eh/h1d0ry2+LxWZwV9Lj8MtO+g+ls5Lx7x5FFPnm/9eHfzgSJOTBEnpogT096bioBtgIBtgIBtcx0jzi/3W/nZdGYr77uxMqchsxo6q+nGLWLWFDFripg1ZcOnk+WXsnpPrMa3P44yfDazLOLFol6srh8R0A4Q0A4Q0G5umehLrFR8yX93npI+3XZAu+QHfjTiR6N+tHHdhIsmJnWboREfmpzUbSa3blzw6qjeCQKChND/bFATOjaysGRpyTZfWXJiyaklZ5asLflgyUdLPlnyefQDZHUNe1EYURoxNqIyYmLE1IiZEbURD0Y8GtFUi1vdxK1u4lY32d3KrW7iVjdxq5u41U3c6iZudRO3uokP6nPGtRBSf5bTCQKChNCeyczAaV7AbsUcDZ9WVe2D1rDFKrZcxY5XsdWYLebZYtrKRbZYxZar2PEqtlr3MOGo5+Xgfhfvr70tqsWyWi6r42W1WlY/qXm6rM6W1XpZfVhWH5fVp3aWDTEBh5iAQ0zAYfVaNu9ngFc3wKsb4NUNak5N3iCfDfLZIJ8N8iHIhyAfgnwI8tkiny3y2SKfbcVJf3cXXJuNRvq7GUWRGxZuWLrhmbyVG07ccOqGMzes3XB7wZhQ9BZFb1H0FkVv7dBbO/TWDr21Q68z5MOQD0M+9ZrUXPoLPu4XnV+q1zGuetO6+tsq46Ss4C6RJLd9Wwb76opnX13x7Ou7V8WdefOwW6ErlqNGHDXiRhX313tZgOwDZB8g+3rclZf7UTWDE5LoJdlLhqd6KemltJeyXtK9dMAvLGzxCwvbqh+mmHBg0oHFDkw5sMSBpQ4sc2DagR0et+P1Kj+a/3avzBgRE0ROkHiCqAmSTJB0gmQTRE+Q7i0IMVZCjJUQYyW0xwrBWCEYKwRjpZ5bzG0uPrldxx23/uZZwoslvVh+9VITlpiwfjlq72IJL5b0YsVerGHtx1+2cseFv3mW8GJJL1bsxVLtUNtgFG4wCjcYhZtuFHbjkGIcUoxDinFIMSNvkdsWuW2RW73GYdme3ungrks0T4nClyh9id51VL7ExJeY+hIzX6L2JR6mROogUteTcROFL1H6EmNfovIlJr7E1JeY+RK1L9HxZJiDyFxPxk0UvkTpS4x9icqXmPgSU19i5kvUvsTWtc0YZkWGWZFhVmSYFXeYFXeYFXeYFXfffrN14sWq9iOt66Teh/aiMKI0YmxEZcTEiFZmmRG1EQ9GPBrxZMSzES9GzI149Z2gjm2PwqfG4FNj8KmxukGT+AS3rnj1kYnBvmi1iVhvItebzLZFzJj8mm/LvIlYbyLXm7QvAYWXjMJLRuElo/WJqvvt2PoJQ+x+Pbfbw/cEacTYyVVONDFmqZOQOVFtzPoPcLj53Iebz324+dyHm899uPnch5vPfbj53Iebz324+dxnUNrRiCdX/w9vxCRt5z+7wuNjJl4zk6+ZzVxf4bgV19nMXlt0E4UvUfoSY1+i8iUmvsTUl5j5ErUv8TD99TeH5ege2nA+mL1f6GUnXrSTL9rFL9qpF+2SF+3SF+2yF+30i3YHl93ogtnQTv1xD5ZnRv0Wd/gxBx99AjOjfmItl9Xxslotq5NldbqszpbVell9WFYf27UaHnMKjzmFx5wGvb/gX/Ov2ffBy8/g5Wfw8rPwe/4qFl+4xdS5EV82Fa+bytdN32iret00ed00fd3UOXXlx2qa+e28jNQYdXr3lOJrLN4xlu8Yx+8Yq3eMk3eM03eM33rO+h3jw+NP86PBfQirmmbGiJggcoLEE0RNkGSCpBOk/dSUIs5IEWekCD3ROhYQ68rob1X8VDZhcyz76KG6fWFzJKveAE+i8CVKX2Ib3WOIqTLEVBliqqz2OvcXlsLplbEQTXjKER4c6cHxqY96lNur/Aw+6j/7+rdDh2kxSstROh6lx/klo3Q6Smf9qjh8EK2naPQksA/3pgp/qvSnxv5UZS375/tBXz6rxtf6jya1r/8XPzU7WtSKRa1c1MaLWvXIdRyVma7GNSTRS7KX4l5S3f4FtwIYbgUw3Apg285/SBHnpohzU8S5Kevi5QzxcoZ4OUO8nCFeThGdpohOU0SnKX++d6vz4oiLc8TFOeLi/KsP8ISfcX6up1X50QGlkoW6jS69PKEJP5r0o3nWTfnREj9a+uh/PIgi3EsR7qUI97bXUeouxLUAjmsBHNcCeLO5biTEgzniwRzxYI67JhyxOo5YHUesjuOGBYfnmsNzzeG55vWoauYX0s4vBPNZnxajtBylx/ZqlE5G6XSU7tY7RCcpopMU0cn+7g2Fd53Cu07hXe9vilDEJSnikhRxyebuzXCMw8vM4WXm8DJzjs7DsYPj2MFx7ODhIEOByyQCl0kELpMIXCZZeOcELosIXBYRuCwiussiTaFYUDkWVI4FlW+sywQc0w3HdMMx3XBMNwybjPbCQdr8MGMEoUckhBiCgpCMf48onNwACB03E+ZZwoslvVixF6trC0HD+64gaDhBw8l3T05agcKKworCisKKwqr+Of/2bkh/RSTEJRYbElNITqF4Cqkp5CgxnULZFNJTqL3NwnCnq78dwLEi8Z1BJITYMT7E5Dn8cowPF0t4saQXK/ZiOQ5U4UxMJ5wPNj0zEetN5HqTeL1Je3mEYWPSBz9D7A/CL4NICN3QZ3g9GF4PhteDGY6CkAxnxLT5rcwIgoAgIcQQFISkrSS2P330MMR6GwYGkRCGA8H5Q1mh447PE6rwp0p/6vh1WiQn/tTZYS5mhsav+WE+byLWm8j1JvF6k9nmyxmTf8w3f95ErDeR603i9SZquBnpdrhD93A4cqrPqMWyWi6r42W1WlYny+p0WZ0tq/Wy+rCs7iO7oQkphyakHJqQcmhCyqEJKYcmpByakHJoQsqhCSmHJqQcfh/bAF7SH7unY6CP1j0nCYvkDgKZOc0ju9g7O+XNTLyZqTcz82Zqn2Z3OykcFPuIRogTX0gMIiF0m3aclHqPWogzYEgNIiF0VjgX9d6HEKfCkBlEQuiscOLqfQ0hjkwhN4iE0C3IIRbtEIt2iEU7NBwFodtLb2C1gdUGVhtYbWC1+e7OlbQ9R1KcW/u0GKXlKB2P0mqUHuefjtKWHy6W0vKFVqmhB3ZJLZbV/9/etSzHjiLR/fzGXTtCoAew6Z+YD3AUD6mqbF+/rrvbHf74sQQHUio9kGaiYxbtRTkhT6ZUlARJZgJmnR1en3RO093b88dPy/0jeno/vTy/PePFnqLKMUrPo9gYZbJ05d2Xy7pieJ2H1ATPiWkhs/V6od4s1NuFerdQv3Q/3UL9eaH+slB/Xah/uMnJ6GEpQI4up+0ngmnPllHfnonWu9BmF9ruQrtd6HYXutuFPu9CX3ahrzfohSHGp0lkY4ewiD/fT9yGM0QKr2xgcvSYDIzNwLjU44UoQezyYjBjHaC3AGYLYLcAjn6R6dJ7Ee9zE6MzMCYD8z0pDGHEwbxMtCa0IbQltCN0S+iO0GdCXwh99aOxxNAtMXRLDN0SQ7fE0C3DLL2GszRGGBr4Wpsm1RgQNjlKazhKazhKazhKB/f5QMC5Gb3nDVynjUg1BkS4TYWvovBVFL6KShgX7gO+sOh9b+B2bWSqMSC8/HC6YyA0CAMiYhyI9uunT0zt7z+SOpEmkTaRLpFEQ5fI8yjQJUaBLjEJsE25epVrVrnfQ8D5+eHDni7egarNx5Az7P/r8N+E/zb8d+F/eHjgkKoRKasRKathvdZwA0X3fgNPZaNSjQERWh4ucAYXOIMLnLGEcSDC/cCWj2ECAQeZKFKNAWG/3sxzPOhmeLcHA++79j7U+sYKnfQetP76PJ2fn7972Gf0GwN6qL1PtdC9B71Pt9mFtrvQ7hZNpmc3MuiUDwjpI0LmiJA9IhSeRAQwGAIYDAEMhgAGQwCDIYDBEMBgCGAwBDAYAhgMAYzhPOKBgF+Xwa/L4Ndl8Osy+HWH7UEGAr5cBl8ugy+XYerI4MsdkmUGApNJhskkw2SSYTLJMJkcRrDhLcR0N0a/BDzAgqUaAyJ0GJjuxkCGwIRc8FRjQPgRaTjZpGjOz37jkkBrQhtCW0K7QAsiK4isILKCyAoiK4msJLKSyEoiK4msIrKKyCoiq4isSrKsSLIDrQltCG0JDdmayNZEtiayNZGtiSxpZ0bamZF2ZqSdGWlnRtqZkXZmpJ0ZaWcmqOwnkf0ksp9E9pPIfo5lW9wP0dMQPQ3R0xA9DdHTED010VMTPTXRUxM9NdFTEz0V0VMRPRXRUxE9FdFTET0l0VMSPSXRUxI9JdFTEj2c6OFEDyd6ONHDiR5O9DCihxE9jOhhRA8jehjRUxA9BdFTED0F0VMQPUXSU6hP8q59knftk7xrn+Rd+yTvKdEjiR5J9EiiRxI9kuiRRA95ngvyPBfkeS7I81yQ57kgz3NBnueCPM8FeZ4L8jwX/nm+MWfIMHdj1GDoPiCkg50On2mN7JIa2SVD0sTg2au8Z6+CJzGW9aRsJuWpvJuU20m5m5TT3lSC7H0lyN5Xgux9JcjeV4LsfSXI3leC7H0lfqP6L4S+EvqB0I+jpJQG07QY6BXwN4sy1RgQfihtMENrMENrMENrMNw2mKFFb7eAT1pUqcaAsOP7wtwrer0FfNOiTjUGRLgm5g0N5g0N5g1NdXRVwyCNyUaDlLum/jFcus/xGJfDzWFuK7BJUYNJRJz/CkxZhUg1BkSQwsMdp7UCk1AhU40BEaRgIcWJqsDkSKhUY0AESwtOegYnPYOTnomEcSCCDQf/AIN/gME/wOKkGP4BJkkewHCDsMoapH01amhJWaBlY9nft8RESxbh2wo8xAKJWQKJWSJi8MgKPLKCeb3s/jQph+vAgpRxYgj3AYP7gMF9wFTCOBDtxpP1hzf0WRyCvrvwcJSevP/sXfuz1Xq+2sxX2/lqN1/d/m+X9sAVcP9vn3w2LutJ2UzKdlJ2k3I7KXeT8nlSvkzK10n5YVJ+/Prn75+//5M/n38g0g4L7Meoqt9ggcX0jS2czsSZTJzNxLlMXJuJ6zJx50zcJRN3zcQ9rP6E5a1IOfcTzuJ0Js5k4mwmzmXi2kxcl4k7Z+IumbhrJu6BpNmJO+26y8+f7o0k2YlR3uAChOYLihHHLHLsIsctcryHTMD4FlhgJri3bjisnVgO1g48XxKpKAImuMD2jgLbO8aJgIDBLWBwi8rrLXGdWA7XwWRClikTSqSsKZGypkTKmhIU6xLZJrJL5DmRl0ReE/mQyEdEA0XKwaDu8zWuXuWaVe5MGp+YPcgsisyueN2U0QdkzAGZI9/HHZBp13euELMHqkV5vdyGKzL6gIw5IGMPyLgDMu12C5olabPcgisy+oCMOSBjD8i4AzKhl4VXQMArILAQL7okBGb9AuvFBNaLDZ4B08LV1aePCJrRM1OvF+rNQv2SfkfqQ4pJYrYLQt1C/Xmh/rJQf/X16/ljHG2wBdPzMDaBmTyYnYeVE5jLg4XHBC6c6OaRcdgUfnSs7iPDgAi3cpML1Dfk+LyvHFhopmniWWzmW8aihFli2CWGW2K0S4xuiXFeYlyWGNfF/SnE4tYUYmXfkDUpfUjKHJKyh6TcIan2kFR3SOqc7KaUnzUKFazz9QbfbPDtBt/dzs2D1+jufPl1MuchKHjHfpDSsJOAf+PhmRVYwiqk7wNqWMyxHPoEuLllHFPgMxXwmQoslR18uWES49cm/HaalPWkbCblqbyblNtJuZuUz5PyZVK+TsphCcPz4/PLY++G9NZyKsMS30LoTYTZRNhNxE1iipxNY5EL6TeraL0LbXah7S40SYGUNJcTIJz2dMrE6UycycTZTJxLgQaJIIFEkEAiSBADCRJBAokggQxBAYR5Ujm8nAjzSIR5JKbeElNvGabaAjpiOehA0Eci6CMx9ZaYesvSy0joiOWgAyEg2Ydc2u83683RcGr4tT2DxlLjgzonQ+zDOUn0x8gYFb9RWhPaENoS2hG6JXRH6DOhL3/TjmSa2GgSrg2JWKJEDqLEBEBiAiAxAZBIeuLIB+XIB+XIB+VFwjgQLe2CRkuSYkeU9l/MAupcoMkF2lygywX6UCJHdiZHdiZHdiZHEI4jO5MjO1NiiiUxxZKNfzsU3pZYDm8LQp8SO0tI2OgSOQTSm+YKYchU9joUwpCq/xXfe/P/PMxPfEB0UqGnFWZacaPjJo9CzqaFyoUk0lW0vkV7W+cGvpCesYEf9ffBikq9800K/SImR4/JwMyMfh55M/wtZJJu4PVOvNmJ33v/GPdesOnHCzb9eMGmHy/Y9OMFm368hE0/AtGBOIO4gPArHCVMWQlTVmI3Fikn+RwSJquEySphssZ3UGGEVhihVeHfOYToUzm8gwjRK2SdKIzgCiO48iO2guM7lYMOOL4VEmk5km05km05km05wTgQoe9Csi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi1Hsi2P4w6SbTmSbTmSbTmSbTmSbTmSbTmSbTmSbRXsGQV7Rnn7RcHFn8qhReHiV/33fjr9eXn6eLozHy9Dx/EjVNx/V/gu45SB0RkYk4HJuR+XgWkzMF0G5uyzxWqfLVYjOy2W9aRsJmU7KbtJuZ2Uu0l5ev3L3xbPHp4c2LkKdq7ydq2q8GzFcni24CBTsMEU7DQFO035kJPChDqVgw5MqBUm1Ap2nIIdp3w6l4Ldn8pBB+x+FZYuDSAYIgqGiIKvV2F6oGBoKBgaKhgWmB6kcrgUpgdK0FVSCr2vQu+rvONAYY6QykER5giq75315Vf7+OnekqlAa2BU5KB0FspkofLuy29bozCmKIwpCmOKCmMKK8KY0hMahAERMAwYBkwYI4L9SMqhJWE/putw6AjZjuHKb7jyG678Rq9cQqrElUvcXTn9jYj5PGoRWCw7wHoP2OwB77pntwfc7gF3e8Bhrf/Y/L4LWQHDEzhm3YfsgPCKHJPTB+XMQTl7UC7sOtY/qIHQIAwICyKCWxAdiDOIC4jraBmhHC0jlJMFilOuXuWaVa5d5bpVbrvK7Va5MStBpmwHmbIdZMp2kCnbQaZsB5myHWTKdpC/Eb2XRF4T+ZDIx0Q+pXGYFRX6oQr9UIV+KIyzjMV+MwyWDLsYM5wAw4Y95AGKaAsiqA5jImMcmAaYMIAyFrvTMJKyYcGar1IAxb5dAYROnnFcTOEaKn0PC4wlbcDQF7MyXdJQABqJoZEYGonFRkLbMHxbhoZgaAgWv2T8brFF0BDYKpZhe37Gw8JqVg5zCN/8QUpAoYBCkVjhohIYCYwEJiSNMx5rYgvHhlWJFcD4hXBULsNRuYzz8eSP4WRthpO1GU7WZhy/Bo7wZTx+4yqxAoHWxbGsDMf8MpwYy3CYLMNhsgxHtzKOX2CYqo3/gvfzyblf73efzx9jXwfxgPZlc3pz3/1jePjQ+oXAOM8w8rNUY0DY9NbhNykkcBySPNUYEDPJDXIpXUYupwxtyugDMuaAzJHvQxPf5FymnRwl4y1A9DbEbENoep4ccdwiJ8zEsdCCY6EFx0ILjoUWHAstuFhdSOCDaZKevDaqGh/FuYXTmTiTibOZOJeJazNxXSbunIm7ZOKumbiHyVSYMfR/LHYaJTqDMtUYEOEhwdobjrU3HGtvuEwYB6L9ek02yGuyQV6TDfKabJDXZIO8JhvkNdkgr8kGeU02yGuyQULoXI0yIOUkt3KWq1e5ZpVrD3XnOu5L2jcU/5rrnSZbxE26qMVzsfIE9VFBc1TQHhV0RwXbo4LdUcHzUcHLUcFrWFql4tIqRVdzTar1fLWZr7bz1W6+uk2bicnbzCg/WC7z9ArPrPDsCs+t8NoVXrfCO6/wLiu8awgc1b/OkxyC75qbFId1lM5CmSyUzUK5mYi9WoryK3S5Q/eGZYwcyxg5ljFyLGPkWMbIsYyxL5SIZZeIZZeIZZeIZZeIZfvdfDqcdtPhtJsOp9104bSbQDgQ7Zd9+Zb4/tD9h+k/bP/h+o+B2/Uf5/7j0n9c+4+H/uOx/3jqP372H8/9x0v/8dp/vPUf7/3Hr/7jo//4vf/4o//4s//47D/+Wkxck4uJa3IlZXBNSh+SMoek7CEpd0iqPSTVHZL67gFO1g6LWHW/yjQVdCpQxqjeENoeeKv0rIyPz84JwUz4enCf7qfpbZD+jaQlPSqZUcmOSm5Uag/dyvdLeXm//OzCjZDCiGNowdKC2x/++Xl5eHCX1LqpjK5qC6E3EWYTYTcRbhPRd4+T6Lyaza1TCzmBq2i9C212oe0utNuF3rmQ/I9f7be+YYAeyO9WuqnSt1WGzdTx2zp7WxWGG2Qclcg4KpFxVCLjqETGURmPRHF/nv64/HV6s+/hnZlU6GmFmVbYaYWbVrSTGSKHX5IjRsTL5C7UAQTPH4dXr4zON5UIDVYkHC7jR+IeBj8lh4eLw2HJRfJK4sLwYZYcXjY1cQOWdXJqxktYEG3U43ANh2s4KIysFqzoitbwjkbCggiYJnn9ghYbb60YmjtcpcVdxtu1CRe/XHR5t6MviVau4p2g+YbjumJTeD3DNt++bjgnDBIO9x6dvtQVPRhJUIQbx1FI/dMAbkV+V7hTK1/Zk3UB/XW4YsUgWxeoQmtXsWVkvAB+reEksyDIwgaaLJzJFIAt1J7wdU9R4IQLaKBj2+n4BQSCCxUjv5xINxW/gsFP4YkqPufwXuOMKVbhaa3wy5Yi3vRw4hruOvlth1Oo4teyaEATHwAHngFeJ40uwma6yOQ2VHM+RzVybi5AqHNTjThmkWMXOW6RE4x7pD2VSHsqkfZUwktVIu1peJ7/u6yRDufodThHr8M5eh3O0fOEAzG+5NPd+/PjR78mauhmfzzdj8p94HEDoTcRZhNhNxFuE7HUlPbyu3v7dQojEy3pUcmMSnZUcqPSzh+NiN7xH6Q0HEC3xtWrXLPKtatct8pt9z+ESMErkYJXIgWvRApeiRS8Eil4JVLwSqTglUjBK5GCVyIFb+gzR9dE2KBE2KBE2KBE2KBE2GDoGK/vxEkaCrBCl3l6hWdWeHaF51Z47XZrw89dws9dws9dws9dws/thyf06g6jcYv+u4KNVKH3ruKQVSG6WsXhEvYQztPrMQYDVxw84kjTQuMJUpEVauo4lqcREyNbjZ883F8bRzwdrQSDocTgChr3FW8wDvWxJXgkh221v+IFNaAnELHGoL1sglsQJ9yjTrcbv6GLVQ6E+SI/QLQB2lTnEgBjec0SQEXzLUB0HJs1CPPPPkEHx1T4BEv4BEv4BEv4BEv4BEe2y+3aR9WvfQz7aJHaYQ3kHrQeeQn4zeybz3gKFlE6C2WyUDYL5bJQ7df7x9Pl19vHcEC4+jGUdLBEFll6mWWWWXaZ5ZZZ7dzzUsETXMETXMETXMETXMETPPSKPkTHCxqw48U4FDjP1atcs8q1q1y3ym2XX5cKboMKboMKboMKboMKboOK7TKgvKu/uXH+NzNBiXWUzkKZLJTNQrl//Qc=';
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
