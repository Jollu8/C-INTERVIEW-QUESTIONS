//// Created by @Jollu8 on 5/18/24.
//// Description https://leetcode.com/problems/one-edit-distance
//// @Solution
#include <vector>
#include <cassert>
#include <string>

using namespace std;
//// @class
class Solution {
public:
    bool isOneEditDistance(string s, string t) {
        int n = s.size(), m = t.size();
        if(n < m) swap(s, t);

        for(int i = 0; i < n; ++i) {
            if(s[i] != t[i]) {
                if(n == m) return s.substr(i+1) == t.substr(i+1);
                return s.substr(i+1) == t.substr(i);
            }
        }
        return n == m+1;

    }
};


#include <cassert>

int main() {
    Solution solution;
    assert(solution.isOneEditDistance("cat", "bat") == true);
    assert(solution.isOneEditDistance("cat", "cats") == true);
    assert(solution.isOneEditDistance("cat", "cut") == true);
    assert(solution.isOneEditDistance("cat", "cat") == false);
    assert(solution.isOneEditDistance("cat", "dog") == false);
    return 0;
}
