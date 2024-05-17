//
//// Created by @Jollu8 on 5/16/24.
//

//// https://leetcode.com/problems/line-reflection
////описание проблемы
////Задача касается набора точек на двумерной плоскости,
////и цель состоит в том, чтобы определить, существует ли линия, параллельная оси Y,
////которая может отражать все точки симметрично. По сути, нам нужно выяснить,
////можем ли мы нарисовать вертикальную линию так, чтобы каждая точка имела зеркальный
////аналог на другой стороне линии. Набор точек до и после отражения их через эту линию должен быть одинаковым,
////даже если некоторые точки повторяются.


#include <iostream>
#include <string>
#include <cmath>
#include <algorithm>
#include <vector>
#include <unordered_set>
#include <utility>
#include <memory>
#include <set>
#include <cassert>
using namespace std;


class Solution {
public:
    bool isReflected(vector<vector<int>> &A) {
        set<pair<int, int>> u;
        int a = 1e9, b = -1e9;

        for (auto &v: A) {
            u.insert({v[0], v[1]});
            a = min(a, v[0]);
            b = max(b, v[0]);
        }
        auto s = a + b;
        for (auto &v: A)
            if (!u.contains({s - v[0], v[1]})) return false;

        return true;
    }
};

void test() {
    vector<vector<int>> v {{1, 1}, {3, 1}, {7, 1}, {9, 1}};
    vector<vector<int>> v1 {{1, 1}, {-1, 1}};
    vector<vector<int>> v2 {{1, 1}, {-1, -1}};
    vector<vector<int>> v3 {{0, 0}, {1, 0}, {2, 0}};
    vector<vector<int>> v4 {{0, 0}, {1, 1}, {2, 2}, {3, 3}, {4, 5}, {5, 5}};
    Solution s;
    assert(s.isReflected(v) == true);
    assert(s.isReflected(v1) == true);
    assert(s.isReflected(v2) == false);
    assert(s.isReflected(v3) == true);
    assert(s.isReflected(v4) == false);

}
int main(){
    test();
    std::cout << "OK!\n";
}


