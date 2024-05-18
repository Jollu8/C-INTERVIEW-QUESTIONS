//// Created by @Jollu8  on 5/18/24.
//// Description https://leetcode.com/problems/trapping-rain-water

#include <iostream>
#include <vector>
#include <cmath>

using namespace std;


class Solution_1 {
public:
    int trap(vector<int> &h) {
        int l{}, r = h.size() - 1, lev{}, water{};
        while (l < r) {
            int low = h[h[l] < h[r] ? l++ : r--];
            lev = max(lev, low);
            water += lev - low;
        }
        return water;
    }
};


