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
    vector<int> findAnagrams(string s, string p) {
        ios_base::sync_with_stdio(0);
        cin.tie(0);
        cout.tie(0);
        vector<int> a(26), b(26), ans;
        int n = s.size(), m = p.size();
        if(n < m) return {};
        for(int i = 0; i < m; ++i) {
            ++a[p[i] - 'a'];
            ++b[s[i] - 'a'];
        }
        if(a == b)ans.push_back(0);
        for(int i = m; i < n; ++i) {
            --b[s[i-m] - 'a'];
            ++b[s[i] - 'a'];

            if(a == b) ans.push_back(i-m+1);
        }
        return ans;

    }
};

int main() {
    Solution s;

    auto ans =  s.findAnagrams("abacb", "abc");  // Выводит: (0,2)

    std::cout << ans.size();
    return 0;
}
