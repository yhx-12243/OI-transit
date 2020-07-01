window.onload = function () {
	if (!window.BigInt) {
		return alert('很抱歉，您的浏览器不支持 BigInt，请升级浏览器后再进入此页面 :)');
	}
	if (!Element.prototype.animate) {
		return alert('很抱歉，您的浏览器不支持 Element.animate，请升级浏览器后再进入此页面 :)');
	}

	const $ = document.getElementById.bind(document),
		  cvs = $('cvs'),
		  NS = cvs.namespaceURI,
		  cst = $('controller-status'),
		  sst = $('stage-status'),
		  stgm = $('stage-main'),
		  pi = parseInt, pf = parseFloat, pb = x => BigInt(x),
		  bonus_up = $('delta-score').animate([
				{transform : 'translateY(25px)', opacity : 0},
				{opacity : 1},
				{transform : 'translateY(-25px)', opacity : 0},
			], {duration : 250, fill : 'forwards', easing: 'cubic-bezier(0,0.75,1,0.25)'}),
		  CLK = window.performance && window.performance.now ? () => window.performance.now() : () => Date.now(),
		  RAF = window.requestAnimationFrame
			 || window.webkitRequestAnimationFrame
			 || window.mozRequestAnimationFrame
			 || window.oRequestAnimationFrame
			 || window.msRequestAnimationFrame
			 || (cb => setTimeout(cb, 83.333, CLK()));

	// ---------------- basic ---------------- //
	let w, h, x0, y0, d, r, R, n, m, t = -1, T, ready = false;
	let bullets, bullets_raw, bonuses, bonuses_raw;
	let min_score, max_score, score_distribution;

	function report_status(s) {cst.innerHTML = s;}
	function report_stage_status(s) {sst.innerHTML = s;}
	function clip(x, min, max) {return Math.min(Math.max(x, min), max);}

	function get_recommend_scale() {
		let cw = cvs.parentNode.parentNode.clientWidth - 10,
			ch = Math.max(Math.min(window.innerHeight, document.documentElement.clientHeight) - 200, 300),
			v = clip(Math.max(w / cw, h / ch), 1e-3, 1e3);
		return v >= 1 ? v.toFixed(3) : v.toPrecision(4);
	}

	function get_recommend_tscale() {return clip(T * .05, 1, 60).toFixed(3);}
	function checkRange(v, i, s, l, t) {return (i <= v && v <= s) || (report_status(`<span class="text-danger">第 ${l} 行：参数 ${t} 等于 ${v}，不在范围 [${i}, ${s}] 中</span>`), false);}

	function correlation(data) {
		let i, j, n = data.length, s0 = 0, s1 = 0, s2 = 0;
		for (i = 0, j = 1 - n; i < n; ++i, j += 2) s0 += data[i], s1 += j * data[i], s2 += data[i] * data[i];
		return (3 * s1 * s1) / ((n * n - 1) * (n * s2 - s0 * s0));
	}

	function get_score_distribution(data) {
		if (data[0] <= 0 || data[0] === data[n - 1]) return 1;
		let li = correlation(data), lo, i;
		for (i = 0; i < data.length; ++i) data[i] = Math.log(data[i]);
		lo = correlation(data);
		console.log('linear =>', li, ' logarithm =>', lo);
		return li >= lo ? 1 : 2;
	}

	async function load_file(fn) {
		report_status('读取文件中 ...');
		let text = await fn.text(), lines = text.split('\n').map(x => x.trimEnd()).filter(x => x);
		if (!lines.length) return report_status('<span class="text-danger">空地图文件</span>');
		let i, first_line = lines[0].split(' '), ok = true;

		report_status('解析文件中 (0%) ...');
		if (first_line.length !== 7)
			return report_status('<span class="text-danger">第 1 行：格式错误</span>');

		ok = ok && checkRange(w = pi(first_line[0]), 1, 2048, 1, 'w');
		ok = ok && checkRange(h = pi(first_line[1]), 1, 2048, 1, 'h');
		ok = ok && checkRange(x0 = pf(first_line[2]), 0, w, 1, 'x<sub>0</sub>');
		ok = ok && checkRange(y0 = pf(first_line[3]), 0, h, 1, 'y<sub>0</sub>');
		ok = ok && checkRange(d = pf(first_line[4]), 0, 2048, 1, 'd');
		ok = ok && checkRange(r = pf(first_line[5]), 0, 2048, 1, 'r');
		ok = ok && checkRange(R = pf(first_line[6]), r, 2048, 1, 'R');
		if (!ok) return;

		report_status('解析文件中 (10%) ...');
		if (!checkRange(n = pi(lines[1]), 0, 32767, 2, 'n')) return;

		report_status('解析文件中 (20%) ...');
		bullets_raw = [];
		for (i = 0; i < n; ++i) {
			if ((i & 255) == 0) report_status(`解析文件中 (${(39 * i / n + 20).toFixed(0)}%) ...`);
			let l = lines[2 + i] ? lines[2 + i].split(' ') : [];
			if (l.length !== 8)
				return report_status(`<span class="text-danger">第 ${3 + i} 行：格式错误</span>`);
			ok = ok && checkRange(l[0] = pi(l[0]), 0, 32767, 3 + i, `a<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[1] = pi(l[1]), l[0], 32767, 3 + i, `b<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[2] = pf(l[2]), 0, w, 3 + i, `x<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[3] = pf(l[3]), 0, h, 3 + i, `y<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[4] = pf(l[4]), -32767, 32767, 3 + i, `vx<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[5] = pf(l[5]), -32767, 32767, 3 + i, `vy<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[6] = pf(l[6]), 0, 2048, 3 + i, `r<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[7] = pb(l[7]), 0, Infinity, 3 + i, `g<sub>${1 + i}</sub>`);
			if (!ok) return;
			bullets_raw.push(l);
		}
		bullets_raw.sort((x, y) => x[7] === y[7] ? x[6] - y[6] : Number(x[7] - y[7]));
		if (n > 0) {
			min_score = Number(bullets_raw[0][7]);
			max_score = Number(bullets_raw[n - 1][7]);
			switch (score_distribution = get_score_distribution(bullets_raw.map(x => Number(x[7])))) {
				case 1: break;
				case 2: min_score = Math.log(min_score), max_score = Math.log(max_score); break;
			}
		} else
			score_distribution = 1;

		report_status('解析文件中 (59%) ...');
		if (!checkRange(m = pi(lines[2 + n]), 0, 32767, 3 + n, 'm')) return;

		report_status('解析文件中 (60%) ...');
		bonuses_raw = [];
		for (i = 0; i < m; ++i) {
			if ((i & 255) == 0) report_status(`解析文件中 (${(39 * i / n + 60).toFixed(0)}%) ...`);
			let l = lines[3 + n + i] ? lines[3 + n + i].split(' ') : [];
			if (l.length !== 3)
				return report_status(`<span class="text-danger">第 ${4 + n + i} 行：格式错误</span>`);
			ok = ok && checkRange(l[0] = pi(l[0]), 0, 32767, 4 + n + i, `s<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[1] = pi(l[1]), 0, 32767, 4 + n + i, `e<sub>${1 + i}</sub>`);
			ok = ok && checkRange(l[2] = pb(l[2]), 0, Infinity, 4 + n + i, `S<sub>${1 + i}</sub>`);
			if (!ok) return;
			bonuses_raw.push(l);
		}
		bonuses_raw.sort((x, y) => x[1] === y[1] ? Number(x[2] - y[2]) : y[1] - x[1]);

		report_status('解析文件中 (99%) ...');
		T = pi(lines[3 + n + m]);
		if (!checkRange(T, 0, 32767, 4 + n + m, 'T')) return;

		report_status('<span class="text-success">文件加载完毕</span>');

		$('total-time').innerHTML = T.toString().padStart(5, '0');
		$('scale').value = get_recommend_scale().toString();
		$('tscale').value = get_recommend_tscale().toString();
		ready = true;
	}

	async function load_strategy() {
		let fs = $('file-output').files, text, lines, i, j;
		if (!fs.length) return report_status('<span class="text-danger">未选择决策文件</span>');
		text = await fs[0].text(), lines = text.split('\n');
		if (lines.length > 2 || (lines.length === 2 && lines[1]))
			return report_status('<span class="text-danger">决策文件过长</span>');
		text = lines[0].trimEnd();
		if (text.length !== T)
			return report_status(`<span class="text-danger">决策文件第 1 行：期望长度为 ${T} 的字符串，但读取到长度为 ${text.length} 的字符串</span>`);
		for (i = 0; i < T; ++i)
			if (!'WXADQZECS'.includes(text[i])) {
				j = text.charCodeAt(i);
				if (32 <= j && j <= 126) j = text[i];
				else if (0 <= j && j <= 255) j = `<strong>\\x${j.toString(16).padStart(2, '0')}</strong>`;
				else j = `<strong>\\u${j.toString(16).padStart(4, '0')}</strong>`;
				return report_status(`<span class="text-danger">决策文件第 1 行：第 ${i + 1} 个字符 <samp>"${j}"</samp> 不合法</span>`);
			}
		return text;
	}

	$('file-input').addEventListener('input', function () {
		let fs = $('file-input').files;
		ready = false;
		if (fs.length) load_file(fs[0]);
		else report_status('请选择文件');
	});

	// ---------------- keyboard --------------- //
	let KBD = {
		ks : null,
		mem0 : null,
		mem1 : null,
		allow_keys : [87, 88, 65, 68, 81, 90, 69, 67],
		reset() {this.ks = new Set(), this.mem0 = this.mem1 = 0;},
		insert(c) {if (this.ks instanceof Set && this.allow_keys.includes(c)) this.ks.add(c), this.mem0 = c;},
		erase(c) {if (this.ks instanceof Set && this.allow_keys.includes(c)) this.ks.delete(c), this.mem0 === c && (this.mem1 = c);},
		query() {
			let c = this.mem1; this.mem0 = this.mem1 = 0;
			if (this.ks.has(87) && this.ks.has(65)) return 'Q';
			if (this.ks.has(88) && this.ks.has(65)) return 'Z';
			if (this.ks.has(87) && this.ks.has(68)) return 'E';
			if (this.ks.has(88) && this.ks.has(68)) return 'C';
			for (let i of this.allow_keys) if (this.ks.has(i)) return String.fromCharCode(i);
			return c ? String.fromCharCode(c) : 'S';
		}
	}, KBQ = {
		queue : null,
		allow_keys : [87, 88, 65, 68, 81, 90, 69, 67],
		reset() {this.queue = [];},
		push_back(c) {if (this.queue instanceof Array && this.allow_keys.includes(c)) this.queue.push(c);},
		query() {
			return this.queue.length ? String.fromCharCode(this.queue.shift()) : 'S';
		}
	}, MOUSE = {
		x : null,
		y : null,
		reset() {this.x = this.y = null;},
		set(x, y) {this.x = x, this.y = y;},
		query(x, y) {
			x -= this.x * sc, y -= this.y * sc;
			let a = 'S', b = Math.hypot(x, y), d;
			for (let c in move_hook)
				if ((d = Math.hypot(x + move_hook[c][0], y + move_hook[c][1])) < b) a = c, b = d;
			return a;
		}
	}, sx_transform = x => x, move_hook, shift_key = false;

	document.addEventListener('keydown', function (e) {
		if (!~t) return;
		let c = e.which || e.keyCode;
		if ((c = sx_transform(37 <= c && c <= 40 ? (e.preventDefault(), [65, 87, 68, 88][c - 37]) : c)) && !e.repeat) KBD.insert(c);
		KBQ.push_back(c);
		if (c === 16) shift_key = true;
	});

	document.addEventListener('keyup', function (e) {
		if (!~t) return;
		let c = e.which || e.keyCode;
		if ((c = sx_transform(37 <= c && c <= 40 ? (e.preventDefault(), [65, 87, 68, 88][c - 37]) : c)) && !e.repeat) KBD.erase(c);
		if (c === 16) shift_key = false;
		if (c === 17)
			$('player-graze-circle').style.visibility = ($('player-graze-circle').style.visibility ? '' : 'hidden');
	});

	cvs.addEventListener('mousemove', function (e) {
		let dr;
		if (!e.offsetX || !e.offsetY) {
			dr = e.target.getBoundingClientRect();
			e.offsetX = e.offsetX || (e.clientX - dr.left);
			e.offsetY = e.offsetY || (e.clientY - dr.top);
		}
		MOUSE.set(e.offsetX, e.offsetY);
	});

	// ---------------- gaming ---------------- //
	let sc, tsc, SC, TSC, sw, sh, xi, yi;
	let gradients_fragment, gradient_scores, appears, disappears, grazedQ;
	let begin_time, is_auto, operate_seq, query_key_func;
	let score, last_shot;

	function get_color_of_score(sc) {
		let pct = NaN, r0, g0, b0; sc = Number(sc);
		switch (score_distribution) {
			case 1: pct = (sc - min_score) / (max_score - min_score); break;
			case 2: pct = (Math.log(sc) - min_score) / (max_score - min_score); break;
		}
		pct = (pct === pct ? clip(pct, 0, 1) : 2 / 3);
		if (pct >= 2 / 3)
			r0 = b0 = 255, g0 = Math.round(pct * 255 - 170);
		else
			r0 = b0 = Math.round(pct * 255 + 85), g0 = 0;
		return [`rgb(${(r0 + 256) >> 1}, ${(g0 + 256) >> 1}, ${(b0 + 256) >> 1})`, `rgb(${r0}, ${g0}, ${b0})`, `rgba(${r0}, ${g0}, ${b0}, 0)`];
	}

	function bullet(i, ta, tb, x, y, vx, vy, r, g) {
		this.ta = ta;
		this.tb = tb;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.g = g;
		if (!gradient_scores.has(g)) {
			gradient_scores.add(g);
			let rg = document.createElementNS(NS, 'radialGradient'), [c1, c2, c3] = get_color_of_score(g);
			rg.id = `GR${g}`;
			rg.innerHTML = `<stop offset="0%" style="stop-color: white" /><stop offset="50%" style="stop-color: ${c1}" /><stop offset="79%" style="stop-color: ${c2}" /><stop offset="100%" style="stop-color: ${c3}" />`;
			gradients_fragment.appendChild(rg);
		}
		let ci = document.createElementNS(NS, 'circle');
		ci.setAttribute('cx', x * SC);
		ci.setAttribute('cy', y * SC);
		ci.setAttribute('r', Math.max(r * SC, 2));
		ci.style.fill = `url(#GR${g})`;
		if (vx || vy) {
			let ratio = (tb - ta) * SC;
			(this.movement = ci.animate([
				{transform : 'translate(0px, 0px)'},
				{transform : `translate(${vx*ratio}px, ${vy*ratio}px)`},
			], {duration : (tb - ta) * TSC * 1e3, fill : 'forwards'})).finish();
		}
		this.circle = ci;
	}

	bullet.prototype = {
		alive(t) {return this.ta <= t && t <= this.tb;},
		position(t) {return [this.x + (t - this.ta) * this.vx, this.y + (t - this.ta) * this.vy];}
	}

	let FPS = {
		last : 0,
		data : 0,
		sum : 0,
		fps : 0,
		reset() {this.last = null, this.data = [], this.sum = 0, this.fps = null;},
		update(value) {
			if (this.last !== null) {
				this.sum += value - this.last;
				this.data.push(value - this.last);
				if (this.data.length > 60) this.sum -= this.data.shift();
				this.fps = 1000 * this.data.length / this.sum;
			}
			this.last = value;
		},
		info() {
			return this.fps === null ? '很抱歉，您的浏览器不支持 requestAnimationFrame，无法获得帧率' : `平均帧率：${this.fps.toFixed(2)} Hz`;
		}
	};

	function main_loop(e) {
		if (e) FPS.update(e);
		let tz = CLK() - begin_time, tg = Math.min(Math.floor(tz * tsc * .001), T + 1), offset;
		let i, dx, dy, dist, danger, ratio, delta = BigInt(0);
		console.assert(t <= tg + 1, 'Strange things happen');
		if (tg > T) {
			if (disappears.hasOwnProperty(tg))
				for (i of disappears[tg]) stgm.removeChild(bullets[i].circle);
			return setTimeout(game_end, 1000);
		}
		for (; t <= tg; ++t) {
			if (!is_auto && t && operate_seq[t - 1] === 'S')
				operate_seq[t - 1] = (shift_key ? MOUSE.query(xi, yi) : query_key_func());
			if (t && operate_seq[t - 1] !== 'S') {
				[dx, dy] = move_hook[operate_seq[t - 1]];
				dx += xi, dy += yi;
				if (-1e-9 <= dx && dx <= w + 1e-9 && -1e-9 <= dy && dy <= h + 1e-9) {
					xi = dx, yi = dy;
					$('player-body-circle').setAttribute('cx', xi * SC);
					$('player-body-circle').setAttribute('cy', yi * SC);
					$('player-graze-circle').setAttribute('cx', xi * SC);
					$('player-graze-circle').setAttribute('cy', yi * SC);
					$('cur-coordinate-x').innerHTML = Math.abs(xi).toFixed(2);
					$('cur-coordinate-y').innerHTML = Math.abs(yi).toFixed(2);
				} else
					operate_seq[t - 1] = 'S';
			}
			tz = CLK() - begin_time, offset = tz - t * TSC * 1e3;
			if (appears.hasOwnProperty(t)) {
				let tdf = document.createDocumentFragment();
				for (i of appears[t])
					tdf.appendChild(bullets[i].circle);
				stgm.appendChild(tdf);
				for (i of appears[t])
					if (bullets[i].hasOwnProperty('movement')) bullets[i].movement.currentTime = offset;
			}
			danger = false;
			for (i = 0; i < n; ++i) if (bullets[i].alive(t)) {
				[dx, dy] = bullets[i].position(t), dist = Math.hypot(xi - dx, yi - dy);
				if (dist <= R + bullets[i].r + 1e-9) {
					if (!grazedQ[i])
						bullets[i].circle.style.fill = 'url(#GRZD)',
						score += bullets[i].g, grazedQ[i] = true;
					bullets[i].circle.classList.add('bullet-close');
				} else
					bullets[i].circle.classList.remove('bullet-close');
				danger = danger || dist <= r + bullets[i].r + 1e-9;
			}
			if (danger)
				last_shot = t, $('player').classList.add('danger');
			else
				$('player').classList.remove('danger');
			for (; bonuses.length; ) {
				if (last_shot >= bonuses[bonuses.length - 1][0]) bonuses.pop();
				else if (t >= bonuses[bonuses.length - 1][1]) delta += bonuses[bonuses.length - 1][2], bonuses.pop();
				else break;
			}
			if (disappears.hasOwnProperty(t))
				for (i of disappears[t]) stgm.removeChild(bullets[i].circle);
		}
		if (delta) {
			score += delta, $('delta-score').innerHTML = `+ ${delta}`, bonus_up.play();
		}
		$('cur-time').innerHTML = tg.toString().padStart(5, '0');
		$('cur-score').innerHTML = score.toString();
		if (bonuses.length)
			$('next-bonus-time').innerHTML = (bonuses[bonuses.length - 1][1] - tg).toString(),
			$('next-bonus-amount').innerHTML = bonuses[bonuses.length - 1][2].toString();
		else
			$('next-bonus-time').innerHTML = 'N/A',
			$('next-bonus-amount').innerHTML = 'N/A';
		report_stage_status(FPS.info());
		RAF(main_loop);
	}

	async function game_init(type) {
		let cb, di = d * Math.SQRT1_2;

		if (!ready) return report_status('<span class="text-danger">配置未成功，请选择文件！');
		sc = pf($('scale').value), SC = 1. / sc;
		if (!(.001 <= sc && sc <= 1000))
			return report_status(`<span class="text-danger">尺寸比例尺 1 : ${sc} 不在范围 [10<sup>-3</sup>, 10<sup>3</sup>] 中</span>`);
		tsc = pf($('tscale').value), TSC = 1. / tsc;
		if (!(1 <= tsc && tsc <= 60))
			return report_status(`<span class="text-danger">时间比例尺 1 : ${tsc} 不在范围 [1, 60] 中</span>`);
		sw = Math.max(Math.round(w * SC), 1), sh = Math.max(Math.round(h * SC), 1);
		if (sw < 10 && sh < 10 && !confirm('过小的比例尺会降低视觉体验，确定继续？'))
			return $('scale').value = get_recommend_scale().toString();
		if (sw > 16384 || sh > 8192)
			return $('scale').value = get_recommend_scale().toString(), report_status(`<span class="text-danger">尺寸比例尺 1 : ${sc} 过大，不适于在屏幕中显示，请调整。`);
		if (sw > 2000 && sh > 1500 && !confirm('过大的比例尺会降低视觉体验，确定继续？'))
			return $('scale').value = get_recommend_scale().toString();
		if (is_auto = type) {
			operate_seq = await load_strategy();
			if (!operate_seq) return;
		} else {
			operate_seq = 'S'.repeat(T);
		}
		operate_seq = operate_seq.split('');
		cvs.setAttribute('width', sw + 'px'), cvs.setAttribute('height', sh + 'px');

		report_status('<span class="text-success">配置成功，准备进入游戏 ...</span>');
		report_stage_status('准备中 ...');

		window.scrollTo({
			top : $('stage-title').parentNode.offsetTop - 10,
			behavior : 'smooth'
		});

		$('file-input').disabled = true;
		$('file-output').disabled = true;
		$('scale').disabled = true;
		$('tscale').disabled = true;
		$('queue-op').disabled = true;
		$('sx-swap').disabled = true;
		$('download-op').disabled = true;
		$('start-manual').disabled = true;
		$('start-auto').disabled = true;
		$('stage-text-elem').setAttribute('x', sw / 2);
		$('stage-text-elem').setAttribute('y', sh / 2);
		$('stage-text-elem').style.fontSize = '36px';
		$('stage-text-elem').textContent = 'Preparing ...';
		$('stage-text-elem').style.visibility = '';
		$('player-body-circle').setAttribute('cx', x0 * SC);
		$('player-body-circle').setAttribute('cy', y0 * SC);
		$('player-body-circle').setAttribute('r', Math.max(r * SC, 2));
		$('player-graze-circle').setAttribute('cx', x0 * SC);
		$('player-graze-circle').setAttribute('cy', y0 * SC);
		$('player-graze-circle').setAttribute('r', Math.max(R * SC, 2));
		$('cur-coordinate-x').innerHTML = x0.toFixed(2);
		$('cur-coordinate-y').innerHTML = y0.toFixed(2);
		sx_transform = $('sx-swap').checked ? (x => x === 83 || x === 88 ? x ^ 11 : x) : (x => x);
		move_hook = {
			'W' : [0, -d],
			'X' : [0, d],
			'A' : [-d, 0],
			'D' : [d, 0],
			'Q' : [-di, -di],
			'Z' : [-di, di],
			'E' : [di, -di],
			'C' : [di, di],
		};
		query_key_func = $('queue-op').checked ? () => KBQ.query() : () => KBD.query();
		bonuses = [...bonuses_raw];

		setTimeout(() => {
			const count_down = t => {
				$('stage-text-elem').style.fontSize = '100px';
				$('stage-text-elem').textContent = t;
			}, insert_to = (o, k, v) => {
				if (!o.hasOwnProperty(k)) o[k] = [];
				o[k].push(v);
			};
			$('stage-bullet-definitions').innerHTML = '';
			stgm.innerHTML = '';
			gradients_fragment = document.createDocumentFragment();
			gradient_scores = new Set();
			appears = {}, disappears = {}, bullets = [];
			for (let i = 0; i < n; ++i) {
				bullets[i] = new bullet(i, ...bullets_raw[i]);
				insert_to(appears, bullets[i].ta, i);
				insert_to(disappears, bullets[i].tb + 1, i);
			}
			$('stage-bullet-definitions').appendChild(gradients_fragment);
			setTimeout(count_down, 50, '3');
			setTimeout(count_down, 1050, '2');
			setTimeout(count_down, 2050, '1');
			setTimeout(game_begin, 3050);
		}, 50);
	}

	function game_begin() {
		$('stage-text-elem').style.visibility = 'hidden';
		report_status('<span class="text-success">游戏进行中 ...</span>');
		KBD.reset(), KBQ.reset(), FPS.reset(), begin_time = CLK();
		score = BigInt(0), t = 0, xi = x0, yi = y0, last_shot = -1;
		grazedQ = new Array(n).fill(false);
		RAF(main_loop);
	}

	function game_end() {
		for (let i = 0; i < n; ++i)
			bullets[i].circle.style.fill = `url(#GR${bullets[i].g})`,
			bullets[i].circle.classList.remove('bullet-close');
		report_status('<span class="text-info">游戏已结束，您可以点击上方的蓝色按钮导出决策文件</span>');
		report_stage_status('已结束');
		t = -1;
		$('player-body-circle').setAttribute('cx', 1e18);
		$('player-body-circle').setAttribute('cy', 1e18);
		$('player-graze-circle').setAttribute('cx', 1e18);
		$('player-graze-circle').setAttribute('cy', 1e18);
		$('stage-text-elem').style.fontSize = '24px';
		$('stage-text-elem').textContent = `最终成绩：${score}`
		$('stage-text-elem').style.visibility = '';
		$('file-input').disabled = false;
		$('file-output').disabled = false;
		$('scale').disabled = false;
		$('tscale').disabled = false;
		$('queue-op').disabled = false;
		$('sx-swap').disabled = false;
		$('download-op').disabled = false;
		$('start-manual').disabled = false;
		$('start-auto').disabled = false;
	}

	$('start-manual').addEventListener('click', function () {game_init(false);});

	$('start-auto').addEventListener('click', function () {game_init(true);});

	$('download-op').addEventListener('click', function () {
		if (Array.isArray(operate_seq) && operate_seq.length === T) {
			let fn = $('file-input').value, a;
			fn = fn.substr(Math.max(fn.lastIndexOf('/'), fn.lastIndexOf('\\')) + 1);
			a = fn.lastIndexOf('.'), fn = (~a ? fn.substr(0, a) : fn);
			a = document.createElement('a');
			a.href = URL.createObjectURL(new Blob([operate_seq.join('') + '\n'], {type : 'text/plain'}));
			a.download = `${fn}.out`, a.click();
			URL.revokeObjectURL(a.href);
		} else {
			alert('尚未找到决策，请先开始游戏');
		}
	});
}
