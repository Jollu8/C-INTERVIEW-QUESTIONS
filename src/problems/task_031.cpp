//// Created by Jollu Emil on 5/19/24.
//// Description 560. Subarray Sum Equals K https://leetcode.com/problems/subarray-sum-equals-k/description/
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    int subarraySum(vector<int> &A, int k, int sum = 0, int cnt = 0) {
        unordered_map<int, int> mp;
        mp[0]++;
        for (int i{}; i < A.size(); ++i) {
            cnt += A[i];
            if (auto f = mp.find(cnt - k); f != mp.end()) sum += f->second;
            mp[cnt]++;
        }
        return sum;
    }
};
