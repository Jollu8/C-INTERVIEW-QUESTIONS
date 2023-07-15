#include <iostream>

template <typename T>
class MyPair {
public:
    MyPair(T first, T second) : first(first), second(second) {}
    T getFirst() const { return first; }
    T getSecond() const { return second; }
private:
    T first;
    T second;
};

int main() {
    MyPair<int> intPair(1, 2);
    std::cout << intPair.getFirst() << ' ' << intPair.getSecond() << '\n';

    MyPair<std::string> stringPair("hello", "world");
    std::cout << stringPair.getFirst() << ' ' << stringPair.getSecond() << '\n';

    return 0;
}
