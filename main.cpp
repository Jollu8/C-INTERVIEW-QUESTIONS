//
// Created by jollu on 07.08.22.
//


#include <string>
#include <iostream>
std::string foo(std::string &str) {
    std::string res;
    for(int i(0); i < str.size(); i++) {
        if(tolower(str[i] < 'z')) res += str[i] +1;
        else res += "a";
    }
    return res;
}

int main() {
    std::string str = "abz";
    std::cout << foo(str);

}