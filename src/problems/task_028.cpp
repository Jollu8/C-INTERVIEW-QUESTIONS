//// Created by @Jollu8 on 5/18/24.
//// Description
/// Написать функцию, которая делает RLE сжатие строки, например "abbccc"→ "ab2c3"
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

using namespace std;

class Solution {
public:
    string LRE(string &s, string ans = "") {
        ans = s[0];
        for (int cnt = 1, i = 1; i < s.size(); ++i) {
            if (ans.back() == s[i])++cnt;
            else {
                ans += (cnt > 1) ? to_string(cnt) : "";
                cnt = 1;
                ans.push_back(s[i]);
            }
            if (i + 1 == s.size() && cnt > 1) ans += to_string(cnt);
        }
        std::cout << ans << '\n';
        return ans;
    }
};


int main() {
    using namespace std::string_literals;
    string str = "aaabbcccssssc"s;
    Solution s;
    assert(s.LRE(str) == "a3b2c3s4c"s);
    std::cout << "OK!\n"s;

}