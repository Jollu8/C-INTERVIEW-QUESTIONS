//// Created by @author Jollu8  on 5/17/24.
//// @Description https://leetcode.com/problems/product-of-array-except-self/description/
//// @Solution

#include <vector>
#include <numeric>

using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int> &A) {
        int n = A.size(), r = 1;
        vector<int> ans(n);
        ans[0] = 1;

        for (int i = 1; i < n; ++i) ans[i] = ans[i - 1] * A[i - 1];
        for (int i = n - 1; i >= 0; --i) {
            ans[i] = ans[i] * r;
            r *= A[i];
        }
        return ans;
    }
};
