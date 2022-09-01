//
// Created by Jollu Emil on 9/1/22.
//


#include <iostream>
#include <unordered_set>


std::unordered_set<int> copy_element(std::unordered_set<int> &v1, std::unordered_set<int> &v2) {
    std::unordered_set<int> res;

    for (auto it: v1) {
        if (v2.contains(it)) {
            res.insert(it);
        }
    }
    return res;
}

//int main() {
//    std::unordered_set<int> v1 = {1, 2, 3, 4, 5, 6};
//    std::unordered_set<int> v2 = {1, 2, 3, 5, 7};
//    auto res = copy_element(v1, v2);
//    for (auto i: res) {
//        std::cout << i << ' ';
//    }
//}