#include <bits/stdc++.h>
using namespace std;
const int SIZE = 100100;
const int BASE = 2017;
const int MOD = 1000000009;
int64_t hash[SIZE];
void init_hash(const string &line, int64_t *h, int base, int mod) {
    h[0] = 0;
    int n = line.length();
    for (int i = 1; i <= n; ++i) {
        h[i] = h[i - 1] * base % mod + (signed char)line[i - 1] % mod;
    }
}
