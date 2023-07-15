#include <iostream>

template <typename T>
T getMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << getMax(1, 2) << '\n';
    std::cout << getMax(3.14, 2.71) << '\n';
    std::cout << getMax<std::string>("hello", "world") << '\n';

    return 0;
}
