#include <bits/stdc++.h>
#define N 34
#define K 1034
using namespace std;

typedef long long ll;
const ll mod = 1000000007;

int n, k, t, i, j;
int b[K];
ll fact[N], inv[N], coe[N];
ll D[N][N], ans, r;

void dfs(int x, int w, ll M){
	int i;
	if(x >= t)
		(coe[w] += M) >= mod ? coe[w] -= mod : 0;
	else
		for(i = 0; i <= b[x]; ++i)
			dfs(x + 1, w + i, M * D[b[x]][i] % mod);
}

int main(){
	freopen("sequence.in", "r", stdin);
	freopen("sequence.out", "w", stdout);
	fact[0] = fact[1] = inv[1] = 1;
	for(i = 2; i < N; ++i){
		fact[i] = fact[i - 1] * i % mod;
		inv[i] = (mod - mod / i) * inv[mod % i] % mod;
	}
	for(i = 0; i < N; ++i)
		for(t = i * (i + 1), D[i][0] = j = 1; j <= i; ++j)
			D[i][j] = D[i - 1][j - 1] * t % mod * inv[j] % mod;
	scanf("%d%d", &n, &k);
	for(i = 1; i <= n; ++i) {scanf("%d", &t); ++b[t % k];}
	sort(b, b + k, greater <int> ());
	for(t = 0; t < k && b[t]; ++t);
	for(i = 0; i < t; ++i) --b[i];
	dfs(0, 0, 1); ans = 0;
	for(i = 0; i <= n - t; ++i){
		r = fact[n - i] * coe[i] % mod;
		ans += (i & 1 ? mod - r : r);
		ans >= mod ? ans -= mod : 0;
	}
	printf("%lld\n", ans);
	return 0;
}

