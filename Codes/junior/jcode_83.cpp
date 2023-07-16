#include <map>
#include <string>
#include <iostream>

int main() {
    std::map<std::string, int> data = {{"Alice", 5}, {"Bob", 3}};

    if (auto it = data.find("Alice"); it != data.end()) {
        std::cout << "Found Alice with value " << it->second << std::endl;
    } else {
        std::cout << "Did not find Alice" << std::endl;
    }
}

