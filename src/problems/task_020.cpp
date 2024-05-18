//// Created by @Jollu8  on 5/18/24.
//// Description

#include <functional>
#include <vector>
#include <string>

using namespace std;

//// @class
class Solution {
public:
    vector<string> generateParenthesis(int n, vector<string> ans = {}) }
        function<void(int, int, string)> func = [&](int l, int r, string s) {
            using namespace std::string_literals;
            if (s.size() == n * 2) ans.emplace_back(s);
            if (l < n) func(l + 1, r, s + "("s);
            if (r < l) func(l, r + 1, s + ")"s);
        };
        func(0, 0, ""s);
        return ans;
    }
};