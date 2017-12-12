#include <bits/stdc++.h>
#define R 54
#define C 7
#define S 280000
#define setdown(x) down[j] = x; nk = combine(down)
using namespace std;

typedef long long ll;
const ll mod = 1000000007;

const int pow6[8] = {1, 6, 36, 216, 1296, 7776, 46656, 279936};

int r, c, n;
int i, j, k, d, ri;
int nk, nl;

int b[R][C], down[C];

ll __dp1[5][S], __dp2[5][S], (*cur)[S] = __dp1, (*nxt)[S] = __dp2, t;

/* 0: end.            
   1: one step
   2: two steps
   3: three steps
   4: can't combine (2)
   5: can't turn right (2)
*/

inline void add(ll &x, const ll y) {(x += y) >= mod ? x -= mod : 0;}

inline void apart(int ret, int *_arr) {for(int i = 0; i < c; ++i, ret /= 6) _arr[i] = ret % 6;}

inline int combine(int *_arr){
	int ret = 0, i;
	for(i = c - 1; ~i; --i) ret = ret * 6 + _arr[i];
	return ret;
}

int main(){
	freopen("tetris.in", "r", stdin);
	freopen("tetris.out", "w", stdout);
	scanf("%d%d%d", &r, &c, &n);
	if(r * c - n & 3) return putchar(48), putchar(10), 0;
	for(i = 0; i < n; ++i) {scanf("%d%d", &j, &k); b[j][k] = 1;}
	for(i = 0; i < c; ++i) b[r][i] = 1;
	nxt[0][0] = 1;
	for(i = 0; i < r; ++i)
		for(j = 0; j < c; ++j){
			swap(cur, nxt);
			memset(nxt, 0, sizeof __dp1);
			for(ri = 0; ri < 5; ++ri) // right
				for(k = 0; k < pow6[c]; ++k)
					if(t = cur[ri][k]){
						//printf("f[пп %d][ап %d][ср %d][об %d] = %lld\n", i, j, ri, k, t);
						apart(k, down); d = down[j]; // down
						if(b[i][j]){
							if(!(d || ri)) add(nxt[0][k], t); // no insertions
						}else{
							if(!(d || ri)){ // new block
								add(nxt[3][k], cur[0][k]); // -> -> ->
								setdown(1); add(nxt[2][nk], t); // -> -> |
								setdown(5); add(nxt[1][nk], t); // -> | |
								setdown(3); add(nxt[0][nk], t); // | | |
							}else if(!d) // only right
								switch(ri){
									case 1: add(nxt[0][k], t); break; // ->
									case 2:
									case 4: {
										add(nxt[1][k], t); // -> (->)
										setdown(1); add(nxt[0][nk], t); break; // -> (|)
									}
									case 3: {
										add(nxt[2][k], t); // -> (-> ->)
										setdown(1); add(nxt[1][nk], t); // -> (-> |)
										setdown(4); add(nxt[0][nk], t); break; // -> (| |)
									}
								}
							else if(!ri) // only down
								switch(d){
									case 1: {setdown(0); add(nxt[0][nk], t); break;} // |
									case 2:
									case 4: {
										setdown(0); add(nxt[1][nk], t); // | (->)
										setdown(1); add(nxt[0][nk], t); break;  // | (|)
									}
									case 5: {setdown(1); add(nxt[0][nk], t); break;} // | (|)
									case 3: {
										setdown(0); add(nxt[4][nk], t); // | (-> ->)
										setdown(1); add(nxt[1][nk], t); // | (-> |)
										setdown(2); add(nxt[0][nk], t); break; // | (| |)
										break;
									}
								}
							else{ // to combine
								if(d == 3 && ri == 3){
									setdown(0); add(nxt[1][nk], t); // -> | (->)
									setdown(1); add(nxt[0][nk], t); // -> | (|)
								}else if(d == 3 && ri == 2){
									setdown(0); add(nxt[0][nk], t); // --> |
								}else if((d == 2 || d == 5) && ri == 3){
									setdown(0); add(nxt[0][nk], t); // -> ||
								}
							}
						}
					}
			if(j == c - 1)
				for(d = 1; d < 5; ++d) memset(nxt[d], 0, S << 3);
		}
	printf("%lld\n", nxt[0][0]);
	return 0;
}

