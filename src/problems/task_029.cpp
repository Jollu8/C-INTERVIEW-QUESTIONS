//// Created by @Jollu8  on 5/19/24.
//// Создать класс с ассимптотиками unordered map, а также способной равновероятно выдавать один из входящих элементов
//// https://leetcode.com/problems/insert-delete-getrandom-o1/

#include <vector>
#include <unordered_map>
#include <cmath>
#include <random>

using namespace std;

class RandomizedSet {
    unordered_map<int, int> mp;
    vector<int> v;
public:
    RandomizedSet() {

    }

    bool insert(int val) {
        if (mp.contains(val)) return false;
        mp[val] = v.size();
        v.push_back(val);
        return true;
    }

    bool remove(int val) {
        if (!mp.contains(val)) return false;
        auto f = mp[val];
        v[f] = v.back();
        mp[v[f]] = f;
        mp.erase(val);
        return true;
    }

    int getRandom() {
        return v[rand() % v.size()];
    }
};