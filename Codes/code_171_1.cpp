//
// Created by Jollu Emil on 8/29/22.
//

#include <iostream>

int my_atoi(std::string str) {

    int ans = 0;
    for(int i = 0; i <str.size(); i++) {
        ans = ans * 10 + str[i] - '0';
    }
    return ans;
}
//
//int main() {
//    auto res = my_atoi("123");
//    std::cout << res + 1;
//}
