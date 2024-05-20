//// No2 [Yandex]
//// Написать функцию, которая делает RLE сжатие строки, например "abbccc"→ "ab2c3"

////  @Solution
#include <vector>
#include <cassert>
#include <string>
#include <algorithm>
#include <iostream>

using namespace std;

class Solution_2 {
public:
    string LRE(string &s) {
        string ans;
        ans += s[0];
        if (s.size() == 1) return ans;

        for (int cnt = 1, r = 1; r < s.size(); ++r) {
            if (s[r - 1] == s[r])++cnt;
            else if (cnt > 1) {
                ans += {(char) (cnt + '0'), s[r]};
                cnt = 1;
            } else ans += s[r];
            if (r + 1 == s.size())ans += (cnt > 1 ? string() + (char) (cnt + '0') : "");
        }
        return ans;
    }
};

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
