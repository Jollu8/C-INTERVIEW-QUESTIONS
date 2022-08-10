//
// Created by jollu.
//
//

#include <iostream>
#include <unordered_set>
#include <memory>
#include <vector>
#include <algorithm>
#include <map>
#include <utility>
#include <string>

bool is_anagramm(std::string  str1, std::string str2)
{
    std::unordered_map<std::string, int> map1;
    std::map<std::string, int> map2;

    if (str1.length() != str2.length())
    {
        return false;
    }
    else
    {
        for (int i = 0; i < str1.size(); ++i)
        {
            std::string ss;
            ss += str1[i];
            map1[ss] = i;
            std::string s(std::to_string(str1[i]));
            map2.insert(std::make_pair<std::string, int>(str1[i], i));
        }
    }
//    if (map1 == map2) return true;
//    else return false;
}

int main() {
    auto countDigits = [](std::vector<int> &v) {
        std::unordered_set<int> ans(v.begin(), v.end());
        return std::make_shared<std::vector<int>>(ans.begin(),  ans.end());
    };

    std::vector<int> vec{1, 2, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 8, 73};
    auto count = countDigits(vec);
    for(auto it = count->begin(); it != count->end(); ++it) std::cout << *it << " ";

}