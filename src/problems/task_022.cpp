//// Created by @Jollu8 on 5/18/24.
//// Description https://leetcode.com/problems/group-anagrams/description/
////  @Solution
#include <vector>
#include <cassert>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <numeric>

using namespace std;


class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& s) {
        unordered_map<string, int> mp;
        vector<vector<string>> ans(s.size());
        int index{};
        for (auto& w : s) {
            auto tmp = w;
            sort(w.begin(), w.end());
            if (auto f = mp.find(w); f != mp.end())
                ans[f->second].emplace_back(tmp);
            else
                ans[mp[w] = index++].emplace_back(tmp);
        }
        ans.resize(index);
        return ans;
    }
};
