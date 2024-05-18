//// Created by @Jollu8 on 5/18/24.
//// DEscription https://leetcode.com/problems/move-zeroes/description/

#include <vector>
#include <cassert>
#include <string>

using namespace std;

class Solution {
public:
    void moveZeroes(vector<int> &A) {
        for(int s{}, f{}; f < A.size(); f = (A[f] ? swap(A[s++], A[f]), f+1 : f+1));
    }
};
