const hex_tab = '0123456789abcdef';

function hex_sha1(s) {return binb2hex(core_sha1(str2binb(s), s.length << 3));}

function str_sha1(s) {return binb2str(core_sha1(str2binb(s), s.length << 3));}

function core_sha1(x, len) {
	x[len >> 5] |= 0x80 << (24 - len & 24);
	x[((len + 64 >> 9) << 4) + 15] = len;

	let w = Array(80), a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476, e = 0xc3d2e1f0;

	for (let i = 0; i < x.length; i += 16) {
		let olda = a, oldb = b, oldc = c, oldd = d, olde = e;

		for (let j = 0; j < 80; ++j) {
			w[j] = (j < 16 ? x[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1));
			let t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
			e = d, d = c, c = rol(b, 30), b = a, a = t;
		}

		a = safe_add(a, olda), b = safe_add(b, oldb), c = safe_add(c, oldc), d = safe_add(d, oldd), e = safe_add(e, olde);
	}
	return [a, b, c, d, e];
}

function sha1_ft(t, b, c, d) {return t < 20 ? (b & c) | ((~b) & d) : t < 40 ? b ^ c ^ d : t < 60 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d;}

function sha1_kt(t) {return t < 20 ? 0x5a827999 : t < 40 ? 0x6ed9eba1 : t < 60 ? 0x8f1bbcdc : 0xca62c1d6;}

function safe_add(x, y) {
	let lsw = (x & 0xffff) + (y & 0xffff), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 0xffff;
}

function rol(num, cnt) {return (num << cnt) | (num >>> (32 - cnt));}

function str2binb(str) {
	let bin = [], i;
	for (i = 0; i < str.length * 8; i += 8)
		bin[i >> 5] |= (str.charCodeAt(i >> 3) & 255) << (24 - i & 24);
    return bin;
}

function binb2str(bin) {
	let str = '', i;
	for (i = 0; i < bin.length * 32; i += 8)
		str += String.fromCharCode(bin[i >> 5] >>> (24 - i & 24) & 255);
	return str;
}

function binb2hex(bin) {
	let str = '', i;
	for (i = 0; i < bin.length * 8; ++i)
		str += hex_tab[(bin[i >> 3] >> ((7 - i & 7) * 4)) & 15];
	return str;
}

function hex2binb(str) {
	let bin = [], i;
	for (i = 0; i < str.length; ++i)
		bin[i >> 3] |= hex_tab.indexOf(str[i]) << ((7 - i & 7) * 4);
	return bin;
}
