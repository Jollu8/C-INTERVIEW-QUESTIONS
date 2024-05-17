//// Created by Jollu8 on 5/17/24.
//// Description https://leetcode.com/problems/perfect-squares/description/
////  @Solution_3, Solution_2

#include <vector>
#include <cmath>
#include <queue>

using namespace std;

//// @class
class Solution_3 {
public:
    int numSquares(int n) {
        queue<int> q({n});
        int ans{};

        while (!q.empty()) {
            int size = q.size();
            ans++;
            while (size--) {
                int cur = q.front();
                q.pop();
                for (int i = 1; i * i <= cur; ++i) {
                    int sub = cur - i * i;
                    if (!sub)
                        return ans;
                    q.push(sub);
                }
            }
        }
        return 0;
    }
};


//// @class
class Solution_2 {
public:
    int numSquares(int n, int m = 1) {
        vector<long long> dp(max(m, n+1), INT_MAX);
//        dp[0] = 0;
        for(int i{}, ii; (ii = i*i) <= n; ++i)
            for(int j = max(m, ii); j<=n; ++j)
                dp[j] = min(dp[j], dp[j-ii]+1);
        return dp[n];
    }
};