#include <bits/stdc++.h>
#define N 68
#define inv(x) PowerMod(x, mod - 2)
using namespace std;

typedef long long ll;

const ll mod = 1000000007;

int n, m, h, K;
int i, j, k, x, _;
ll u[N], U;
ll ans, res, gk;
ll Xi, UXi, invX;
ll f[N];

ll fact[1001], finv[1001];

ll PowerMod(ll a, int n, ll m = mod){
	if(!n || a == 1) return 1ll;
	ll s = PowerMod(a, n >> 1, m);
	(s *= s) %= m;
	return n & 1 ? s * a % m : s;
}

inline ll C(int n, int k){
	if(k < 0) return 0ll;
	return fact[n] * finv[k] % mod * finv[n - k] % mod;
}

ll Lagrange(int x){
	int i, j; ll res = 0, t;
	for(i = 0; i <= n + 1; ++i){
		t = f[i];
		for(j = 0; j <= n + 1; ++j){
			if(i == j) continue;
			t = t * (x - j + mod) % mod * inv(i - j + mod) % mod;
		}
		res += t;
	}
	return res;
}

int main(){
	int T;
	freopen("problem.in", "r", stdin);
	freopen("problem.out", "w", stdout);
	// factorial and inverse
	for(fact[0] = i = 1; i <= 1000; ++i) fact[i] = fact[i - 1] * i % mod;
	finv[1000] = PowerMod(fact[1000], mod - 2);
	for(i = 1000; i; --i) finv[i - 1] = finv[i] * i % mod;
	for(scanf("%d", &T); T; --T){
		scanf("%d%d%d", &m, &n, &K); h = n + 1 >> 1;
		for(i = 1; i <= m; ++i) scanf("%lld", u + i);
		ans = 0;
		for(k = K; k <= n; ++k){
			gk = 1; f[0] = 0;
			for(U = 1; U <= n + 1; ++U){
				f[U] = 0;
				for(x = 1; x <= U; ++x){
					Xi = PowerMod(x, n); UXi = 1; invX = inv(x);
					for(i = n; i >= h; --i){
						res = Xi * UXi % mod;
						res = res * C(n - k, i - k) % mod;
						(f[U] += res) >= mod ? f[U] -= mod : 0;
						Xi = Xi * invX % mod;
						UXi = UXi * (U - x) % mod;
					}
				}
				//printf("f[%d] = %lld\n", U, f[U]);
			}
			for(_ = 1; _ <= m; ++_)
				gk = gk * Lagrange(u[_]) % mod;
			res = C(n - K, k - K) * gk % mod;
			ans += ((k ^ K) & 1 ? mod - res : res);
			ans %= mod;
		}
		printf("%lld\n", ans);
	}
	return 0;
}

/*
f(k) 前 k 道会做，后 n-k 道不会做
g(k) 前 k 道会做，后 n-k 道未知
f(k) = g(k) - C(n-k, 1) g(k+1) + C(n-k, 2) g(k+2) - ... + (-1)^(n-k) C(n-k, n-k) g(n)

+ 插值.

g(0) = 7 x 22 = 154
[1] 1  1 [1] 1  2 [1] 2  1 [2] 1  1 [2] 1  2 [2] 2  1 [2] 2  2
---------
[1] 1  1 [1] 1  2 [1] 1  3 [1] 2  1 [1] 3  10
[2] 1  1 [2] 1  2 [2] 1  3 [2] 2  1 [2] 2  2 [2] 2  3 [2] 3  1 [2] 3  2
[3] x9

g(1) = 6 x 18 = 108
[1] 1  1 [1] 1  2 [2] 1  1 [2] 1  2 [2] 2  1 [2] 2  2
---------
[1] 1  1 [1] 1  2 [1] 1  3 [2] 1  1 [2] 1  2 [2] 1  3
[2] 2  1 [2] 2  2 [2] 2  3 [3] x9

g(2) = 5 x 14 = 70
[1] 1  1 [2] x4
---------
[1] 1  1 [2] x4 [3] x9

*/

