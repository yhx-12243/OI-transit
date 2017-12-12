#include <bits/stdc++.h>
#define N 100034
#define K 15
using namespace std;

typedef bitset <4096> bit;

int n, k, cnt, q;
int op, u, v, t, res;
int p[K][N];
bit B[N];

inline void up(int &x, const int y) {x < y ? x = y : 0;}

int main(){
	int i, j;
	freopen("compose.in", "r", stdin);
	freopen("compose.out", "w", stdout);
	scanf("%d%d%d", &n, &k, &q);
	for(i = 1; i <= k; ++i){
		for(j = 1; j <= n; ++j) scanf("%d", p[i] + j);
		for(j = 0; j < 1 << k; ++j) B[i].set(j, j >> i - 1 & 1);
	}
	cnt = k;
	for(; q; --q)
		switch(scanf("%d%d%d", &op, &u, &v), op){
			case 1: {B[++cnt] = B[u] | B[v]; break;}
			case 2: {B[++cnt] = B[u] & B[v]; break;}
			case 3: {res = 0;
				for(i = 1; i <= k; ++i){
					t = 0;
					for(j = k; j; --j)
						t = t << 1 | p[j][v] >= p[i][v];
					if(B[u].test(t)) up(res, p[i][v]);
				}
				printf("%d\n", res); break;
			}
		}
	return 0;
}

