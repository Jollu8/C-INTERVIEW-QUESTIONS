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

//class Solution {
//public:
//    string LRE(string &s) {
//        string ans;
//        ans += s[0];
//        if (s.size() == 1) return ans;
//
//        for (int cnt = 1, r = 1; r < s.size(); ++r) {
//            if (s[r - 1] == s[r])++cnt;
//            else if (cnt > 1) {
//                ans += {(char) (cnt + '0'),  s[r]};
//                cnt = 1;
//            } else ans += s[r];
//            if (r + 1 == s.size())ans += (cnt > 1 ? string() + (char) (cnt + '0') : "");
//        }
//        return ans;
//    }
//};


class Solution {
public:
    string LRE(string &s) {
        string ans;
        ans += s[0];
        for (int cnt = 1, i = 1; i < s.size();) {
            while (i < s.size() && ans.back() == s[i]) {
                ++cnt;
                ++i;
            }
            if (cnt > 1)
                ans += to_string(cnt);
            if (i < s.size())
                ans += s[i];
            cnt = 1;
            ++i;
        }
        std::cout << ans << '\n';
        return ans;
    }
};

int main() {
    string str = "abbccc";
    Solution s;
    assert(s.LRE(str) == "ab2c3");
}






