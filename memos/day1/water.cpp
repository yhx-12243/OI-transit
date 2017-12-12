#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#define N 68
#define M 136
using namespace std;

typedef long long ll;
const ll DFS_STATE_COUNT = 3ll << 27;
const int TIME_LIMIT = CLOCKS_PER_SEC * 7 >> 3;

struct limit{
	int inf, sup;
	limit (int infi = 0, int supi = 0): inf(infi), sup(supi) {}
	bool operator < (const limit &B) const {return sup + B.inf < inf + B.sup;}
};

ll state_count = 1;

int n, m, i, j;
int op, u, v;
int cnt[N], ord[N];
int ans;
limit a[N];
double temp;

inline bool cmp(const int x, const int y) {return cnt[x] < cnt[y];}

inline void down(int &x, const int y) {x > y ? x = y : 0;}

void dfs(int x, int w){
	int i, c;
	if(w > ans) return;
	if(x > n)
		down(ans, w);
	else
		for(i = a[x].inf; i <= a[x].sup; ++i){
			c = cnt[i] << 1 | 1;
			++cnt[i];
			dfs(x + 1, w + c);
			--cnt[i];
		}
}

bool accepted(int x, int i){
	int nw = cnt[ord[x]] << 1 | 1, nxt = cnt[ord[x + 1]] << 1 | 1;
	if(nw << 2 < nxt) return false; // refuse the bad solution (4x)
	double ratio = (double)nxt / (double)nw, pro = exp((temp - ratio) / log(i + 1));
	int G = (double)RAND_MAX * pro;
	return rand() < G;
}

void random_greedy(){
	char *_ = new char; srand((unsigned long long)_); delete _;
	int __, i, j, k, cost; temp = 0.47;
	for(; clock() < TIME_LIMIT; ) for(__ = 100; __; --__){
		cost = 0;
		memset(cnt, 0, sizeof cnt);
		for(i = 1; i <= n; ++i){
			for(k = 0, j = a[i].inf; j <= a[i].sup; ++j) ord[k++] = j;
			random_shuffle(ord, ord + k);
			sort(ord, ord + k, cmp);
			for(j = 0; j < k - 1; ++j) if(!accepted(j, i)) break;
			//printf("a[%d] = #%d/%d = %d\n", i, j, k, ord[j]);
			if((cost += (cnt[ord[j]]++) << 1 | 1) > ans) break;
		}
		//printf("cost = %d\n", cost);
		down(ans, cost);
		temp -= 0.005;
	}
}

int main(){
	freopen("water.in", "r", stdin);
	freopen("water.out", "w", stdout);
	scanf("%d%d", &n, &m);
	for(i = 1; i <= n; ++i) a[i] = limit(1, n);
	for(i = 0; i < m; ++i){
		scanf("%d%d%d%d", &op, &j, &u, &v);
		for(; j <= u; ++j) (op == 1 ? a[j].inf : a[j].sup) = v;
	}
	sort(a + 1, a + (n + 1));
	for(i = 1; i <= n; ++i){
		if(a[i].sup < a[i].inf) return putchar(45), putchar(49), 0;
		if((state_count *= (a[i].sup - a[i].inf + 1)) > DFS_STATE_COUNT) break;
	}
	ans = n * n;
	if(i > n){ // state_count < DFS_STATE_COUNT
		memset(cnt, 0, sizeof cnt);
		dfs(1, 0);
	}else{
		random_greedy();
	}
	printf("%d\n", ans);
	return 0;
}

