//
// Created by jollu.
//
//RC4 Algorithm

#include <string>
#include <vector>
#include <iostream>
//#include <unordered_map>
#include <algorithm>

using namespace std;


class Solution {
public:
    bool rotateString(string s, string goal) {
        while(next_permutation(goal.begin(),goal.end())) {
            if(s == goal) return true;
        }
        return false;
    }
};

int main() {
    for (auto i = 'a'; i <= 'z'; ++i) {
        cout << i << " ";

    }
}