#include <bits/stdc++.h>
#define N 100034
#define STN 682936
#define inv(x) PowerMod(x, mod - 2)
#define segc int M = L + R - 1 >> 1, lc = id << 1, rc = lc | 1
using namespace std;

typedef long long ll;
const ll mod = 1000000007;

struct node{
	ll v, tag; int zeros;
	node (ll v0 = 0, ll tag0 = 0, int zeros0 = 0): v(v0), tag(tag0), zeros(zeros0) {}
};

int n, q, i;

ll a[N], z, ans;

node st[STN];

inline ll Plus(ll x, const ll y) {return (x += y) >= mod ? x - mod : x;}
inline int Min(const int x, const int y) {return x < y ? x : y;}
inline int Max(const int x, const int y) {return x < y ? y : x;}

ll PowerMod(ll a, ll n, ll m = mod){
	if(!n || a == 1) return 1ll;
	ll s = PowerMod(a, n >> 1, m);
	(s *= s) %= m;
	return n & 1 ? s * a % m : s;
}

void build(int id, int L, int R){
	if(L == R) {st[id] = node(1, 1, 0); return;}
	segc; build(lc, L, M); build(rc, M + 1, R);
	st[id] = node(Plus(st[lc].v, st[rc].v), 1, 0);
}

void push_down(int id, int L, int R){
	if(st[id].tag > 1){
		segc;
		st[lc].v = st[lc].v * st[id].tag % mod;
		st[rc].v = st[rc].v * st[id].tag % mod;
		st[lc].tag = st[lc].tag * st[id].tag % mod;
		st[rc].tag = st[rc].tag * st[id].tag % mod;
		st[id].tag = 1;
	}
}

void azr(int id, int L, int R, int h, int v){ // change state zero
	if(L == R) {st[id].zeros = v; return;}
	push_down(id, L, R); segc;
	h <= M ? azr(lc, L, M, h, v) : azr(rc, M + 1, R, h, v);
	st[id].v = Plus(st[lc].v, st[rc].v);
	st[id].zeros = st[lc].zeros | st[rc].zeros;
}

void mul(int id, int L, int R, int ql, int qr, ll v){ // range multiply (v != 0)
	if(ql <= L && R <= qr){
		st[id].v = st[id].v * v % mod;
		st[id].tag = st[id].tag * v % mod; return;
	}
	push_down(id, L, R); segc;
	if(ql <= M) mul(lc, L, M, ql, Min(qr, M), v);
	if(qr > M) mul(rc, M + 1, R, Max(ql, M + 1), qr, v);
	st[id].v = Plus(st[lc].v, st[rc].v);
	st[id].zeros = st[lc].zeros | st[rc].zeros;
}

ll range(int id, int L, int R){
	if(!st[id].zeros) return st[id].v;
	if(L == R) return 0; // zero !
	push_down(id, L, R); segc;
	return st[lc].zeros ? range(lc, L, M) : Plus(st[lc].v, range(rc, M + 1, R));
}

inline void mul(int h, ll v) {v ? mul(1, 1, n, h, n, v) : azr(1, 1, n, h, 1);}

inline void div(int h, ll v) {v ? mul(1, 1, n, h, n, inv(v)) : azr(1, 1, n, h, 0);}

int main(){
	freopen("rand.in", "r", stdin);
	freopen("rand.out", "w", stdout);
	scanf("%d%d", &n, &q);
	build(1, 1, n);
	for(z = 2, i = n - 1; i; --i) {mul(1, 1, n, i, i, z); z = z * 3 % mod;}
	for(i = 1; i <= n; ++i) {scanf("%lld", a + i); mul(i, a[i]);}
	for(; q; --q){
		scanf("%d%lld", &i, &z);
		div(i, a[i]); mul(i, z);
		a[i] = z;
		printf("%lld\n", range(1, 1, n));
	}
	return 0;
}

