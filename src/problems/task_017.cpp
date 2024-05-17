//// Created by @Jollu8 on 5/17/24.
//// Description
//// @Solution_1

#include <vector>

using namespace std;

class Solution_1 {
public:
    int longestSubarray(vector<int> &A, int l = 0, int r = 0) {
        for (int cnt = 1; r < A.size(); ++r) {
            cnt = !A[r] ? cnt - 1 : cnt;
            cnt = (cnt < 0 && !A[l++]) ? cnt + 1 : cnt;
        }
        return r - l - 1;
    }
};

