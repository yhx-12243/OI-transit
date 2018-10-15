function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length << 3));
}

function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length << 3));
}

function core_sha1(x, len) {
    x[len >> 5] |= 0x80 << (24 - len & 24);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 0x67452301;
    var b = 0xefcdab89;
    var c = 0x98badcfe;
    var d = 0x10325476;
    var e = 0xc3d2e1f0;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

}

function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

function sha1_kt(t) {
    return (t < 20) ? 0x5a827999 : (t < 40) ? 0x6ed9eba1 : (t < 60) ? 0x8f1bbcdc : 0xca62c1d6;
}

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

function str2binb(str) {
	var bin = [], i;
	for (i = 0; i < str.length * 8; i += 8)
		bin[i >> 5] |= (str.charCodeAt(i >> 3) & 255) << (24 - i & 24);
    return bin;
}

function binb2str(bin) {
	var str = '', i;
	for (i = 0; i < bin.length * 32; i += 8)
		str += String.fromCharCode(bin[i >> 5] >>> (24 - i & 24) & 255);
	return str;
}

function binb2hex(bin) {
    var hex_tab = '0123456789abcdef', str = '', i;
    for (i = 0; i < bin.length * 8; ++i)
        str += hex_tab[(bin[i >> 3] >> ((7 - i & 7) * 4)) & 15];
    return str;
}

function hex2binb(str) {
	var hex_tab = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,b:11,c:12,d:13,e:14,f:15}, bin = [], i;
	for (i = 0; i < str.length; ++i)
		bin[i >> 3] |= hex_tab[str[i]] << ((7 - i & 7) * 4);
	return bin;
}
