//// Created by @author Jollu8  on 5/17/24.
//// @Desciption https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/
//// @Solution_1 (::npos) , @Solution_2 (kmp)

#include <string>

using namespace std;

//// @class
class Solution {
public:
    int strStr(string h, string n) {
        if(auto f = h.find(n); f != string::npos) return f;
        return -1;
    }
};

//// @class
class Solution_2 {
public:
    int strStr(string h, string n) {
        int ans = -1, ns = n.size();

        for (int i{}, j = ns - 1; j < h.size(); ++i, ++j) {
            int l{};
            for (int k = i; l < ns && (h[k] == n[l]); ++k, ++l);
            if (l == ns) {
                ans = i;
                break;
            }
        }
        return ans;
    }
};