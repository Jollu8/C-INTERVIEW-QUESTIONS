// Created by @Jollu8  on 5/17/24.

//// @Solution
/// Дано три массива, и число k, нужно определить есть ли такие три числа, что их сумма равна k и они лежат в разных массивах
/// bool HasTreeSum(const vector<int>& first, const vector<int>& second, const vector<int>& third, int k)
/// k = 9
/// [1 , 2 , 3 , 4 , 5]
/// [2 , 3 , 6 , 1 , 2]
/// [3 , 2 , 4 , 5 , 6]
/// 1  + 2  + 6 = 9 --> true


#include <iostream>
#include <vector>
#include <unordered_set>
#include <cassert>

#define N // D for debug

using namespace std;

//// @class
class Solution {
    using CVI = const vector<int>;
public:
    bool HasThreeSum(CVI &a, CVI &b, CVI &c, int k) {
        unordered_set<int> u(a.begin(), a.end());
        int ans{};
        for (auto i: b)
            for (auto j: c)
                if (u.contains(k - i - j)) {
#ifdef D
                    std::cout << i << " " << j << " " << k - i - j << '\n';
#endif
                    return true;
                }
        return false;
    }
};


void test() {
    Solution s;
    vector<vector<int>> v1{
            {1, 2, 3, 4, 5},
            {2, 3, 6, 1, 2},
            {3, 2, 4, 5, 6},
    };
    vector<vector<int>> v2{
            {1, 2, 3, 4, 5},
            {2, 3, 6, 1, 2},
            {3, 2, 4, 5, 6},
    };
    assert(s.HasThreeSum(v1[0], v1[1], v1[2], 9) == true);
    assert(s.HasThreeSum(v2[0], v1[1], v1[2], 0) == false);
    assert(s.HasThreeSum(v1[0], v1[1], v1[2], 99) == false);


}

int main() {
    test();
    std::cout << "OK!\n";
}
