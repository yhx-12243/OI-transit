#include <bits/stdc++.h>
#include <unistd.h>
using namespace std;

int n, i, a, b;

char s[100];

int main(int argc, char *argv[]){
	if(argc <= 1) return 0;
	sscanf(argv[1], "%d", &n);
	srand((unsigned long long)new char);
	
	do {b = rand(); itoa(b, s, 10);} while(!access(s, 0));
	printf("%d - ", b);
	
	for(i = 1; i <= n; ++i){
		a = b;
		
		do {b = rand(); itoa(b, s, 10);} while(!access(s, 0));
		printf("%d - ", b);
		
		sprintf(s, "echo %d > %d\n", b, a);
		system(s);
	}
	sprintf(s, "echo funbpuratkv > %d", b);
	system(s);
	return 0;
}
