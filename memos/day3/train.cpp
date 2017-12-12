#include <bits/stdc++.h>
#define N 256101
using namespace std;

typedef long long ll;

const int ST_MAX = 100000001;

struct addition{
	int x, y, v;
	addition (int r0 = 0, int c0 = 0, int v0 = 0): x(r0), y(c0), v(v0) {}
	bool operator < (const addition &B) const {return x < B.x || x == B.x && y < B.y;}
};

struct node{
	ll v1, v2, v3, v4; int lc, rc;
	node (ll vA = 0, ll vB = 0, ll vC = 0, ll vD = 0, int lchild = 0, int rchild = 0):
		v1(vA), v2(vB), v3(vC), v4(vD), lc(lchild), rc(rchild) {}
	inline void up(const node A, const node B){
		v1 = A.v1 + B.v1; v2 = A.v2 + B.v2; v3 = A.v3 + B.v3; v4 = A.v4 + B.v4;
	}
};

int r, c, n, q;
int n0, i, j;
// modifies
int r1, c1, r2, c2, s;
ll ans;
// additions
addition add[N];
// time - segment tree
node x[10000000];
int cnt, root[N];

ll Av1, Av2, Av3, Av4;

inline int Min(const int x, const int y) {return x < y ? x : y;}
inline int Max(const int x, const int y) {return x < y ? y : x;}

int adj(int id, int L, int R, int h){
	int nid = ++cnt; x[nid] = x[id];
	if(L == R){
		x[nid].up(x[nid], node(Av1, Av2, Av3, Av4));
		return nid;
	}
	int M = L + R - 1 >> 1;
	h <= M ? x[nid].lc = adj(x[id].lc, L, M, h) : (x[nid].rc = adj(x[id].rc, M + 1, R, h));
	x[nid].up(x[nid].lc[x], x[nid].rc[x]);
	return nid;
}

node query(int id, int L, int R, int ql, int qr){
	if(!id) return node();
	if(ql <= L && R <= qr) return x[id];
	int M = L + R - 1 >> 1; node v = node();
	if(ql <= M) v.up(v, query(x[id].lc, L, M, ql, Min(qr, M)));
	if(qr > M) v.up(v, query(x[id].rc, M + 1, R, Max(ql, M + 1), qr));
	return v;
}

ll range(int rr, int cc){
	if(!(rr && cc)) return 0;
	addition T(rr, INT_MAX, 0);
	int p = lower_bound(add + 1, add + (n0 + 1), T) - (add + 1);
//	printf("rr = %d, cc = %d, p = %d\n", rr, cc, p);
	node R = query(root[p], 1, ST_MAX, 1, cc);
	ll ret = R.v1 * rr * cc - R.v2 * rr - R.v3 * cc + R.v4;
	return ret;
}

int main(){
	freopen("train.in", "r", stdin);
	freopen("train.out", "w", stdout);
	scanf("%d%d%d%d", &r, &c, &n, &q);
	for(cnt = 0; n; --n){
		scanf("%d%d%d%d%d", &r1, &r2, &c1, &c2, &s);
		add[++n0] = addition(r1, c1, s);
		add[++n0] = addition(++r2, c1, -s);
		add[++n0] = addition(r1, ++c2, -s);
		add[++n0] = addition(r2, c2, s);
	}
	sort(add + 1, add + (n0 + 1));
	root[0] = cnt = 1;
	for(i = 1; i <= n0; ++i){
		Av1 = add[i].v; Av2 = Av1 * (add[i].y - 1); Av3 = Av1 * (add[i].x - 1); Av4 = Av2 * (add[i].x - 1);
		root[i] = adj(root[i - 1], 1, ST_MAX, add[i].y);
	}
	for(ans = 0; q; --q){
		scanf("%d%d", &r2, &c2); r2 %= r; c2 %= c;
		r1 = ans % r + 1; (r2 += r1) > r ? r2 -= r : 0; if(r1 > r2) swap(r1, r2);
		c1 = ans % c + 1; (c2 += c1) > c ? c2 -= c : 0; if(c1 > c2) swap(c1, c2);
		ans = range(r2, c2); ans -= range(--r1, c2);
		ans -= range(r2, --c1); ans += range(r1, c1);
		printf("%llu\n", ans);
	}
	return 0;
}

