#include <fstream>
#include <string>
#include <iostream>
#include <algorithm>
#include <set>


int main() {
    std::ifstream input("input.txt");
    std::string a, b;
    input >> a >> b;
    input.close();
    std::set<char> s(a.begin(), a.end());
    int n = 0;
    for(auto i : s) {
        n += std::count(b.begin(), b.end(), i);
    }
    std::ofstream output("output.txt");

    output << n;
    output.close();
}