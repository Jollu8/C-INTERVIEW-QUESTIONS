//// 228. Summary Ranges https://leetcode.com/problems/summary-ranges/description/

#include <string>
#include <vector>
#include <iostream>
#include <cassert>

using namespace std;

class Solution {
public:
    vector<string> summaryRanges(vector<int> &A) {
        vector<string> ans;
        for (int l = 0, r = 0; r < A.size(); ++r) {
            if (r + 1 == A.size() || A[r] + 1 != A[r + 1]) {
                ans.emplace_back(l != r ? to_string(A[l]) + "->" + to_string(A[r]) : to_string(A[r]));
                l = r + 1;
            }
        }
        return ans;
    }
};

int main() {
    using namespace std::string_literals;
    Solution s;
    vector<int> v1{0, 1, 2, 4, 5, 7};
    vector<string> v1a{"0->2"s, "4->5"s, "7"s};
    assert(s.summaryRanges(v1) == v1a);
    std::cout << "OK!'\n";

}