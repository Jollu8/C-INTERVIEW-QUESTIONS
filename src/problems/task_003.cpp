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

class Solution_1 {
public:
    bool isReflected(vector<vector<int>> &A, set<pair<int, int>> u = {}) {
        std::transform(A.begin(), A.end(), std::inserter(u, u.begin()),
                       [](auto &v) -> pair<int, int> { return {v[0], v[1]}; });

        auto s = u.begin()->first + u.rbegin()->first;
        return std::all_of(A.begin(), A.end(),
                           [&u, &s](const vector<int> &v) { return u.contains({s - v.front(), v.back()}); });
    }
};


class Solution_2 {
public:
    bool isReflected(vector<vector<int>> &A, set<pair<int, int>> u = {}) {
        for (auto &v: A)
            u.insert({v[0], v[1]});

        auto s = u.begin()->first + u.rbegin()->first;
        for (auto &v: A) if (!u.contains({s - v.front(), v.back()})) return false;
        return true;
    }
};


class Solution_3 {
public:
    bool isReflected(vector<vector<int>> &A) {
        unordered_map<int, unordered_set<int>> u;
        int a = -1e9, b = 1e9;

        for (auto &v: A) {
            u[v[0]].insert(v[1]);
            a = max(a, v[0]);
            b = min(b, v[0]);
        }
        int s = a + b;
        return all_of(A.begin(), A.end(), [&u, &s](const vector<int> &v) {
            return u[s - v[0]].contains(v[1]);
        });
    }
};

void test();

int main() {
    test();
    std::cout << "OK!\n";
}

void test() {
    vector<vector<int>> v{{1, 1},
                          {3, 1},
                          {7, 1},
                          {9, 1}};
    vector<vector<int>> v1{{1,  1},
                           {-1, 1}};
    vector<vector<int>> v2{{1,  1},
                           {-1, -1}};
    vector<vector<int>> v3{{0, 0},
                           {1, 0},
                           {2, 0}};
    vector<vector<int>> v4{{0, 0},
                           {1, 1},
                           {2, 2},
                           {3, 3},
                           {4, 5},
                           {5, 5}};
    Solution_1 s1;
    Solution_2 s2;
    Solution_3 s3;
    assert(s1.isReflected(v) == true);
    assert(s1.isReflected(v1) == true);
    assert(s1.isReflected(v2) == false);
    assert(s1.isReflected(v3) == true);
    assert(s1.isReflected(v4) == false);

    assert(s2.isReflected(v) == true);
    assert(s2.isReflected(v1) == true);
    assert(s2.isReflected(v2) == false);
    assert(s2.isReflected(v3) == true);
    assert(s2.isReflected(v4) == false);

    assert(s3.isReflected(v) == true);
    assert(s3.isReflected(v1) == true);
    assert(s3.isReflected(v2) == false);
    assert(s3.isReflected(v3) == true);
    assert(s3.isReflected(v4) == false);

}

