//
// Created by Jollu Emil on 9/1/22.
//

#include <iostream>
#include <unordered_map>


void delete_element_from_u_map(std::unordered_map<int, int> &m) {
    for (auto it = m.begin(); it != m.end();) {
        if (it->second % 2 == 0) {
            std::cout << it->first << ' ';
            it = m.erase(it);
        } else it++;
    }
}

int main() {
    std::unordered_map<int, int> m{};

    for (auto i = 0; i < 10; i++) {
        m[i] = i;
    }
    delete_element_from_u_map(m);
}