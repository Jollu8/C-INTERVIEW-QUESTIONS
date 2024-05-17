//// Created by @Jollu8 on 5/16/24.
//// Description https://leetcode.com/problems/find-the-prefix-common-array-of-two-arrays/
//// @Solution_1, @Solution_2
#include <vector>
#include <bitset>
#include <algorithm>

using namespace std;


/// @class
class Solution_1 {
public:
    vector<int> findThePrefixCommonArray(vector<int> &A, vector<int> &B) {
        vector<int> ans(A.size());
        bitset<51> a, b;
        for (int i = 0; i < A.size(); i++)
            ans[i] = (a.set(A[i]) & b.set(B[i])).count();

        return ans;
    }
};

class Solution_2 {
public:
    vector<int> findThePrefixCommonArray(vector<int> &A, vector<int> &B) {
        int n = A.size(), cnt{};
        vector<int> ans(n), seen(n + 1);
        for (int i = 0; i < n; ++i) {
            if (++seen[A[i]] == 2)++cnt;
            if (++seen[B[i]] == 2)++cnt;
            ans[i] = cnt;
        }
        return ans;
    }
};
