#include <cstdio>
#define N 682936
#define segc int M = L + R - 1 >> 1, lc = id << 1, rc = lc | 1
using namespace std;

typedef long long ll;

struct node {ll val; int to;};

int n, q, i, j, op;
int l, r, u, v;
node st[10][N];
ll ans;

inline int Min(const int x, const int y) {return x < y ? x : y;}
inline int Max(const int x, const int y) {return x < y ? y : x;}

inline void add_trans(int from, int to, int id){
	for(int i = 1; i <= 9; ++i)
		if(st[i][id].to == from) st[i][id].to = to;
}

void push_down(int id, int lc, int rc){
	int i, j, t[10]; ll z[10];
	for(i = 1; i <= 9; ++i){
		t[i] = st[i][id].to; z[i] = 0;
		st[i][id].to = i;
	}
	for(i = 1; i <= 9; ++i) z[t[i]] += st[i][lc].val;
	for(i = 1; i <= 9; ++i) st[i][lc].val = z[i];
	for(i = 1; i <= 9; ++i) z[i] = 0;
	for(i = 1; i <= 9; ++i) z[t[i]] += st[i][rc].val;
	for(i = 1; i <= 9; ++i) st[i][rc].val = z[i];
	for(i = 1; i <= 9; ++i) {j = st[i][lc].to; z[i] = t[j];}
	for(i = 1; i <= 9; ++i) st[i][lc].to = z[i];
	for(i = 1; i <= 9; ++i) {j = st[i][rc].to; z[i] = t[j];}
	for(i = 1; i <= 9; ++i) st[i][rc].to = z[i];
}

void trans(int id, int L, int R, int ql, int qr, int from, int to){
	node *From = st[from], *To = st[to];
	if(ql <= L && R <= qr){
		st[to][id].val += st[from][id].val; st[from][id].val = 0;
		add_trans(from, to, id); return;
	}
	segc;
	push_down(id, lc, rc);
	if(ql <= M) trans(lc, L, M, ql, Min(qr, M), from, to);
	if(qr > M) trans(rc, M + 1, R, Max(ql, M + 1), qr, from, to);
	for(int i = 1; i <= 9; ++i) st[i][id].val = st[i][lc].val + st[i][rc].val;
}

ll range(int id, int L, int R, int ql, int qr){
	ll s = 0;
	if(ql <= L && R <= qr){
		for(int i = 1; i <= 9; ++i) s += st[i][id].val * i; return s;
	}
	segc;
	push_down(id, lc, rc);
	if(ql <= M) s += range(lc, L, M, ql, Min(qr, M));
	if(qr > M) s += range(rc, M + 1, R, Max(ql, M + 1), qr);
	return s;
}

void add(node *tree, int id, int L, int R, int h, ll v){
	if(L == R) {tree[id].val += v; return;}
	segc; h <= M ? add(tree, lc, L, M, h, v) : add(tree, rc, M + 1, R, h, v);
	tree[id].val = tree[lc].val + tree[rc].val;	
}

int main(){
	freopen("easy.in", "r", stdin);
	freopen("easy.out", "w", stdout);
	for(i = 1; i <= 9; ++i) for(j = 1; j < N; ++j) st[i][j].to = i;
	scanf("%d%d", &n, &q);
	for(i = 1; i <= n; ++i){
		scanf("%d", &v);
		for(u = 1; v; u *= 10, v /= 10)
			if(r = v % 10)
				add(st[r], 1, 1, n, i, u);
	}
	for(; q; --q){
		if(scanf("%d%d%d", &op, &l, &r), op == 1){
			scanf("%d%d", &u, &v);
			if(u != v) trans(1, 1, n, l, r, u, v);
		}else{
			ans = range(1, 1, n, l, r);
			printf("%lld\n", ans);
		}
	}
	return 0;
}

