//// Created by @Jollu8 on 5/18/24.
//// Description https://leetcode.com/problems/find-all-anagrams-in-a-string/description/
///
////  @Solution
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
class Solution {
public:
    string addStrings(string A1, string A2) {
        [&]() {
            int n = A1.size(), m = A2.size();
            if (n > m) A2 = string(n - m, '0') + A2;
            else if (m > n) A1 = string(m - n, '0') + A1;
        }();
        string ans;
        int cnt{};
        ans.reserve(A1.size() + 2);
        for (int i = A1.size() - 1; i >= 0; --i) {
            cnt = cnt * 10 + (A1[i] - '0');
            cnt = cnt * 10 + (A2[i] - '0');
            ans = (char) ('0' + cnt % 10) + ans;
            cnt /= 10;
        }
        if (cnt) ans = std::to_string(cnt) + ans;
        return ans;
    }
};