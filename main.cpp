//
// Created by jollu.
//
//

#include <iostream>
#include <unordered_set>
#include <memory>
#include <vector>
#include <algorithm>

int main() {
    auto countDigits = [](std::vector<int> &v) {
        std::unordered_set<int> ans(v.begin(), v.end());
        return std::make_shared<std::vector<int>>(ans.begin(),  ans.end());
    };

    std::vector<int> vec{1, 2, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 8, 73};
    auto count = countDigits(vec);
    for(auto it = count->begin(); it != count->end(); ++it) std::cout << *it << " ";

}