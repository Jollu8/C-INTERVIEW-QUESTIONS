//// Created by Jollu Emil on 5/19/24.

#include <vector>
#include <iostream>

using namespace std;

class Solution {
public:
    int secondMax(vector<int> &A) {
        int first = INT_MIN, sec = INT_MIN;
        for (auto i: A) {
            if (i > first) {
                sec = first;
                first = i;
            } else if (i > sec && i < first) {
                sec = i;
            }
        }
        return sec;
    }
};


int main() {
    vector<int> v{12, 3, 4, 5};
    Solution s;
    std::cout << s.secondMax(v);
}