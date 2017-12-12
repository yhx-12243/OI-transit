#include <bits/stdc++.h>
#define N 100034
using namespace std;

struct BIT{
	#define lowbit(x) (x & -x)
	int x[N], sz;
	BIT () {memset(x, 0, sizeof x);}
	void add(int h, int v) {for(++h; h <= sz; h += lowbit(h)) x[h] += v;}
	int sum(int h) {int s = 0; for(++h; h; h -= lowbit(h)) s += x[h]; return s;}
	inline int range(int l, int r) {return sum(r) - sum(l - 1);}
	void adj(int h, int v) {int ori = range(h, h); if(v != ori) add(h, v - ori);}
};

typedef long long ll;
const ll mod = 1000000007;

char op[10];
int accept[4][4] = {{1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}, {1, 1, 1, 1}};

int n, m, k, i, j;
int u, v, w;
int a[N];
BIT nxt, prv;
ll f[N][4][4];

int zeros = 0;
ll ans = 1;

ll PowerMod(ll a, ll n, ll m = mod){
	if(!n || a == 1) return 1ll;
	ll s = PowerMod(a, n >> 1, m);
	(s *= s) %= m;
	return n & 1 ? s * a % m : s;
}

inline int Prev(int x) {return prv.sum(x - 1);}
inline int Next(int x) {return nxt.sum(x);}
inline int Mul(ll v) {v ? ans = ans * v % mod : ++zeros;}
inline int Div(ll v) {v ? ans = ans * PowerMod(v, mod - 2) % mod : --zeros;}

int main(){
	freopen("defend.in", "r", stdin);
	freopen("defend.out", "w", stdout);
	scanf("%d%d%d", &n, &m, &k);
	for(; k; --k){
		scanf("%d%d", &u, &v);
		accept[u][v] = 0;
	}
	for(u = 0; u <= 3; ++u)
		for(v = 0; v <= 3; ++v) {f[1][u][v] = u == v; f[2][u][v] = accept[u][v];}
	for(i = 3; i <= n + 2; ++i)
		for(u = 0; u <= 3; ++u)
			for(v = 0; v <= 3; ++v){
				for(w = 1; w <= 3; ++w)
					(f[i][u][v] += f[i - 1][u][w] & -accept[w][v]) >= mod ? f[i][u][v] -= mod : 0;
				//fprintf(stderr, "f[%d][%d][%d] = %lld\n", i, u, v, f[i][u][v]);
			}
	memset(a, -1, sizeof a); a[0] = a[n + 1] = 0;
	prv.sz = nxt.sz = n + 2; nxt.add(0, n + 1); prv.add(n + 1, n + 1);
	Mul(f[n + 2][0][0]);
	for(; m; --m)
		switch(scanf("%s", op), *op){
			case 65:{
				scanf("%d%d", &u, &v);
				if(a[u] == v) break;
				i = Prev(u); j = Next(u);
				if(~a[u]){
					Div(f[u - i + 1][a[i]][a[u]]);
					Div(f[j - u + 1][a[u]][a[j]]);
				}else{
					Div(f[j - i + 1][a[i]][a[j]]);
					nxt.adj(i, u - i); prv.adj(j, j - u);
					prv.add(u, u - i); nxt.add(u, j - u); 
				}
				Mul(f[u - i + 1][a[i]][v]);
				Mul(f[j - u + 1][v][a[j]]);
				a[u] = v;
				break;
			}
			case 68:{
				scanf("%d", &u);
				if(~a[u]){
					i = Prev(u); j = Next(u);
					Div(f[u - i + 1][a[i]][a[u]]);
					Div(f[j - u + 1][a[u]][a[j]]);
					Mul(f[j - i + 1][a[i]][a[j]]);
					nxt.adj(i, j - i); prv.adj(j, j - i);
					nxt.adj(u, 0); prv.adj(u, 0);
					a[u] = -1;
				}
				break;
			}
			case 81:{
				printf("%lld\n", zeros ? 0 : ans);
				break;
			}
		}
	return 0;
}

