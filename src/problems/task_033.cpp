//// Created by @Jollu8 on 5/18/24.
//// Description https://leetcode.com/problems/add-strings/description/
///
////  @Solution_1 , @Solution_2
#include <vector>
#include <cassert>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <numeric>
#include <string>
#include <queue>
#include <iostream>
#include <cassert>
#include <set>
#include <unordered_set>

using namespace std;

//// @class
class Solution_1 {
public:
    string addStrings(string A1, string A2) {
        int cnt{};
        string ans;
        ans.reserve(max(A1.size(), A2.size()) + 2);
        auto a1 = A1.rbegin();
        auto a2 = A2.rbegin();
        for (; a1 != A1.rend() || a2 != A2.rend() || cnt; cnt /= 10) {
            if (a1 != A1.rend()) cnt += (*a1 - '0'), a1++;
            if (a2 != A2.rend()) cnt += (*a2 - '0'), a2++;
            ans += (char) ('0' + cnt % 10);
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};


//// @class
class Solution_2 {
public:
    string addStrings(string A1, string A2) {
        [&]() {
            int n = A1.size(), m = A2.size();
            if (n > m)
                A2 = string(n - m, '0') + A2;
            else if (m > n)
                A1 = string(m - n, '0') + A1;
        }();
        string ans;
        int cnt{};
        ans.reserve(A1.size() + 2);
        for (int i = A1.size() - 1; i >= 0; ++i, cnt /= 10) {
            cnt += (A1[i] - '0') + (A2[i] - 'a');
            ans += (char) ('0' + cnt % 10);
        }
        if (cnt)
            ans += (char) ('0' + cnt);
        reverse(ans.begin(), ans.end());
        return ans;
    }
};

