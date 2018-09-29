syntax_highlight_cpp = [
	[
		[ /(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
		[ /\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
		[ /\/\/\//g, "sh_comment", 1],
		[ /\/\//g, "sh_comment", 7],
		[ /\/\*\*/g, "sh_comment", 8],
		[ /\/\*/g, "sh_comment", 9],
		[ /(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
		[ /^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
		[ /^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
		[ /\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))[uU]?(?:[lL]|ll|LL)?\b/g, "sh_number", -1],
		[ /"/g, "sh_string", 13],
		[ /'/g, "sh_string", 14],
		[ /\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
		[ /\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
		[ /~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
		[ /\{|\}/g, "sh_cbracket", -1],
		[ /(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
		[ /([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
	],
	[
		[ /$/g, null, -2],
		[ /(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
		[ /&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
		[ /@[A-Za-z]+/g, "sh_type", -1],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g, "sh_string", 3]
	],
	[],
	[
		[ /\\(?:\\|")/g, null, -1],
		[ /"/g, "sh_string", -2]
	],
	[
		[ />/g, "sh_preproc", -2],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g,"sh_string", 3]
	],
	[],
	[
		[ /(?:\/)?>/g, "sh_keyword",-2],
		[ /([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
		[ /"/g,"sh_string", 3]
	],
	[
		[ /$/g, null, -2]
	],
	[
		[ /\*\//g, "sh_comment", -2],
		[ /&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
		[ /@[A-Za-z]+/g, "sh_type", -1],
	],
	[
		[ /\*\//g, "sh_comment", -2],
	],
	[
		[ /$/g, null, -2],
		[ /</g, "sh_string", 11],
		[ /"/g, "sh_string", 12],
		[ /\/\/\//g, "sh_comment", 1],
		[ /\/\//g, "sh_comment", 7],
		[ /\/\*\*/g, "sh_comment", 8],
		[ /\/\*/g, "sh_comment", 9]
	],
	[
		[ /$/g, null, -2],
		[ />/g, "sh_string", -2]
	],
	[
		[ /$/g, null, -2],
		[ /\\(?:\\|")/g, null, -1],
		[ /"/g, "sh_string", -2]
	],
	[
		[ /"/g, "sh_string", -2],
		[ /\\./g, "sh_specialchar", -1]
	],
	[
		[ /'/g, "sh_string", -2],
		[ /\\./g, "sh_specialchar", -1]
	]
];

function sh_isEmailAddress(a) {
	return /^mailto:/.test(a) ? !1 : -1 !== a.indexOf("@")
}

function sh_setHref(a, b, c) {
	var d = c.substring(a[b - 2].pos, a[b - 1].pos);
	d.length >= 2 && "<" === d.charAt(0) && ">" === d.charAt(d.length - 1) && (d = d.substr(1, d.length - 2)),
	sh_isEmailAddress(d) && (d = "mailto:" + d),
	a[b - 2].node.href = d
}

function sh_konquerorExec(a) {
	var b = [""];
	return b.index = a.length,
	b.input = a,
	b
}

function sh_highlightString(a, b) {
	var c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J;
	if (/Konqueror/.test(navigator.userAgent) && !b.konquered) {
		for (c = 0; c < b.length; c++)
			for (d = 0; d < b[c].length; d++)
				e = b[c][d][0],
				"$" === e.source && (e.exec = sh_konquerorExec);
		b.konquered = !0
	}
	for (f = document.createElement("a"),
	g = document.createElement("span"),
	h = [],
	i = 0,
	j = [],
	k = 0,
	l = null,
	m = function(b, c) {
		var e, m, n, d = b.length;
		0 !== d && (c || (e = j.length,
		0 !== e && (m = j[e - 1],
		m[3] || (c = m[1]))),
		l !== c && (l && (h[i++] = {
			pos: k
		},
		"sh_url" === l && sh_setHref(h, i, a)),
		c && (n = "sh_url" === c ? f.cloneNode(!1) : g.cloneNode(!1),
		n.className = c,
		h[i++] = {
			node: n,
			pos: k
		})),
		k += d,
		l = c)
	}
	,
	n = /\r\n|\r|\n/g,
	n.lastIndex = 0,
	o = a.length; o > k; ) {
		for (p = k,
		s = n.exec(a),
		null === s ? (q = o,
		r = o) : (q = s.index,
		r = n.lastIndex),
		t = a.substring(p, q),
		u = []; ; ) {
			for (v = k - p,
			x = j.length,
			w = 0 === x ? 0 : j[x - 1][2],
			y = b[w],
			z = y.length,
			A = u[w],
			A || (A = u[w] = []),
			B = null,
			C = -1,
			D = 0; z > D && (D < A.length && (null === A[D] || v <= A[D].index) ? E = A[D] : (F = y[D][0],
			F.lastIndex = v,
			E = F.exec(t),
			A[D] = E),
			null === E || !(null === B || E.index < B.index) || (B = E,
			C = D,
			E.index !== v)); D++)
				;
			if (null === B) {
				m(t.substring(v), null);
				break
			}
			if (B.index > v && m(t.substring(v, B.index), null),
			G = y[C],
			H = G[1],
			H instanceof Array)
				for (J = 0; J < H.length; J++)
				    I = B[J + 1],
				    m(I, H[J]);
			else
				I = B[0],
				m(I, H);
			switch (G[2]) {
			case -1:
				break;
			case -2:
				j.pop();
				break;
			case -3:
				j.length = 0;
				break;
			default:
				j.push(G)
			}
		}
		l && (h[i++] = {
			pos: k
		},
		"sh_url" === l && sh_setHref(h, i, a),
		l = null),
		k = r
	}
	return h
}

function sh_getClasses(a) {
	var d, e, b = [], c = a.className;
	if (c && c.length > 0)
		for (d = c.split(" "),
		e = 0; e < d.length; e++)
			d[e].length > 0 && b.push(d[e]);
	return b
}

function sh_extractTagsFromNodeList(a, b) {
	var d, e, f, c = a.length;
	for (d = 0; c > d; d++)
		switch (e = a.item(d),
		e.nodeType) {
		case 1:
			"br" === e.nodeName.toLowerCase() ? (f = /MSIE/.test(navigator.userAgent) ? "\r" : "\n",
			b.text.push(f),
			b.pos++) : (b.tags.push({
				node: e.cloneNode(!1),
				pos: b.pos
			}),
			sh_extractTagsFromNodeList(e.childNodes, b),
			b.tags.push({
				pos: b.pos
			}));
			break;
		case 3:
		case 4:
			b.text.push(e.data),
			b.pos += e.length
		}
}

function sh_extractTags(a, b) {
	var c = {};
	return c.text = [],
	c.tags = b,
	c.pos = 0,
	sh_extractTagsFromNodeList(a.childNodes, c),
	c.text.join("")
}

function sh_mergeTags(a, b) {
	var d, e, f, g, h, i, c = a.length;
	if (0 === c)
		return b;
	if (d = b.length,
	0 === d)
		return a;
	for (e = [],
	f = 0,
	g = 0; c > f && d > g; )
		h = a[f],
		i = b[g],
		h.pos <= i.pos ? (e.push(h),
		f++) : (e.push(i),
		b[g + 1].pos <= h.pos ? (g++,
		e.push(b[g]),
		g++) : (e.push({
			pos: h.pos
		}),
		b[g] = {
			node: i.node.cloneNode(!1),
			pos: h.pos
		}));
	for (; c > f; )
		e.push(a[f]),
		f++;
	for (; d > g; )
		e.push(b[g]),
		g++;
	return e
}

function sh_insertTags(a, b) {
	for (var j, k, l, c = document, d = document.createDocumentFragment(), e = 0, f = a.length, g = 0, h = b.length, i = d; h > g || f > e; )
		f > e ? (j = a[e],
		k = j.pos) : k = h,
		g >= k ? (j.node ? (l = j.node,
		i.appendChild(l),
		i = l) : i = i.parentNode,
		e++) : (i.appendChild(c.createTextNode(b.substring(g, k))),
		g = k);
	return d
}

function sh_highlightElement(a, b) {
	var c, d, e, f, g;
	for (c = [],
	d = sh_extractTags(a, c),
	e = sh_highlightString(d, b),
	f = sh_mergeTags(c, e),
	g = sh_insertTags(f, d); a.hasChildNodes(); )
		a.removeChild(a.firstChild);
	a.appendChild(g)
}

function syntax_highlight() {
	var c, d, e, f, h, b = document.getElementsByTagName("code");
	for(c = 0; c < b.length; c++){
		d = b.item(c);
		e = sh_getClasses(d);
		for(f = 0; f < e.length; f++){
			if (e[f].toLowerCase() == 'sh_cpp') {
				sh_highlightElement(d, syntax_highlight_cpp);
				break;
			}
		}
	}
}
