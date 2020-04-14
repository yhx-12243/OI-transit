(function (win, $, und) {

	'use strict';

	const
		cfColor = {
			// en
			'pupil' : 'green',
			'specialist' : 'cyan',
			'expert' : 'blue',
			'candidate master' : 'violet',
			'master' : 'orange',
			'international master' : 'orange',
			'grandmaster' : 'red',
			'international grandmaster' : 'red',
			'legendary grandmaster' : 'legendary',
			// ru
			'ученик' : 'green',
			'специалист' : 'cyan',
			'эксперт' : 'blue',
			'кандидат в мастера' : 'violet',
			'мастер' : 'orange',
			'международный мастер' : 'orange',
			'гроссмейстер' : 'red',
			'международный гроссмейстер' : 'red',
			'легендарный гроссмейстер' : 'legendary',
		};

	let
		okay, config = {};

	// ---------------- Configuration ---------------- //
	win.setFileConfig = function (key, val) {
		config[key] = val;
	}

	// ---------------- Records ---------------- //
	win.parseRecords = function (strBack) {
		let i, count = 0, info, result, recs = strBack.split('\n').map(x => x.replace(/[\f\r\v]/g, '').split('|')).filter(x => x.length === 5);
		Rows = [];
		for (i = 0; i < recs.length; ++i) {
			info = recs[i].concat((recs.length - i).toString());
			result = recordMatch(info, curLocation, config);
			if (result.length)
				Rows.push(
					$('<tr />')
						.append($('<td />').html(result[0]))
						.append($('<td />').html(result[1]))
						.append($('<td />')
							.append(
								$('<a href="records/' + encodeURIComponent(info[0]) + '.html" target="_blank">链接</a>')
							)
						)
						.append($('<td />').html(info[1]))
						.append($('<td />').html(info[2]))
						.append($('<td />').html(info[3]))
						.append($('<td />').html(result[2]))
						.get(0)
				), ++count;
		}
		sortTable(curROrder);
		totPage = Math.ceil(count / RECORDS_PER_PAGE);
		curPage = (curPage >= 1 ? Math.min(curPage, totPage) : 1);
		$('#recTable').append(Rows.slice((curPage - 1) * RECORDS_PER_PAGE, curPage * RECORDS_PER_PAGE));
		$('#recTotal').html('统计：' + (count ? (curLocation || config['tag'] || config['search'] ? '当前位置' : '') + '共有 ' + count + ' 条记录' : '怎么一道题都还没有啊，是你瞎编的算法么？'));
		pagination();
	}

	win.fastRedirect = function (strBack) {
		let i, name, recs;
		if ($.isNumeric(this.id) && (i = parseInt(this.id)).toString() === this.id) {
			recs = strBack.split('\n').map(x => x.replace(/[\f\r\v]/g, '').split('|')).filter(x => x.length === 5);
			if (0 < i && i <= recs.length) {
				name = recs[recs.length - i][0];
				return location.replace('records/' + encodeURIComponent(name) + '.html' + location.hash);
			}
		}
		location.replace(getUri({}));
	}

	// ---------------- Templates ----------------- //
	win.getTemplates = function (strBack) {
		tmpArr = strBack.split('\n').map(x => x.replace(/[\f\n\r\v]/g, '')).filter(Boolean), titleT = {}, okay = [];
		tmpArr.forEach((v, i) =>
			$.ajax('templates/' + v + '.xml', {
				type : 'GET',
				dataType : 'xml',
				id : i,
				success : parseTemplate
			})
		);
	}

	function parseTemplate(data) {
		let i = this.id, j, $header, $text;
		titleT[tmpArr[i]] = $('title', data).text();
		$header = $('<h3 />').attr('id', tmpArr[i]).html(titleT[tmpArr[i]] + ' [#' + tmpArr[i] + ']:');
		$text = $('<div />').html($('pre', data).prop('outerHTML')).attr('data-id', i);
		j = okay.slice(0, i).lastIndexOf(true);
		$('#templates>div' + (~j ? '[data-id=' + j + ']' : '.cen')).after($text).after($header);
		okay[i] = true;
	}

	// ---------------- Memos ---------------- //
	win.parseMemos = function (strBack) {
		let info, mems = strBack.split('\n').map(x => x.replace(/[\f\r\v]/g, '').split('|')).filter(x => x.length === 4);
		Rows = mems.map((x, i, all) => {
			info = x.concat((all.length - i).toString());
			return $('<tr />')
				.append($('<td />').html(info[4]))
				.append($('<td />').html(info[0]))
				.append($('<td />')
					.append(
						$('<a href="memos/' + info[4] + '.html" target="_blank">链接</a>')
					)
				)
				.append($('<td />').html(info[1]))
				.append($('<td />').html(info[2]))
				.data('priority', parseInt(info[3]))
				.get(0);
		}).sort(function(a, b) {return $(b).data('priority') - $(a).data('priority') || (+b.cells[0].innerText) - (+a.cells[0].innerText);});
		totPage = Math.ceil(mems.length / MEMOS_PER_PAGE);
		curPage = (curPage >= 1 ? Math.min(curPage, totPage) : 1);
		$('#memTable').append(Rows.slice((curPage - 1) * MEMOS_PER_PAGE, curPage * MEMOS_PER_PAGE));
		$('#memTotal').html('统计: 共 ' + mems.length + ' 份便笺');
		pagination();
	}

	// ---------------- Ranklist ---------------- //
	win.parseRanklist = function (data) {
		let L;
		if (data.status === 'OK')
			Rows = data.result.map(p =>
				$('<tr />')
					.append($('<td />')
						.append(
							$('<a class="user ' + (cfColor.hasOwnProperty(p.rank) ? cfColor[p.rank] : 'gray') + '" href="http://codeforces.com/profile/' + p.handle + '" target="_blank">' + p.handle + '</a>')
						)
					)
					.append($('<td />').html(p.firstName))
					.append($('<td />').html(p.lastName))
					.append($('<td />').html(p.rating))
					.append($('<td />').html(p.maxRating))
					.append($('<td />').html(dateFormat(new Date(p.lastOnlineTimeSeconds * 1e3))))
					.append(
						$('<td />').append(
							(L = getFL(p.handle)) && $('<a href="' + L + '" target="_blank">' + L + '</a>')
						)
					)
					.get(0)
			),
			$('#rankTable>tbody').empty().append(Rows);
	}

})(window ? window : this, jQuery);
