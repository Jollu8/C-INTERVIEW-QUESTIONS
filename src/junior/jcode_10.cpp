#include <iostream>

class Singleton {
public:
    static Singleton& getInstance() {
        static Singleton instance;
        return instance;
    }
private:
    Singleton() {}
    Singleton(const Singleton&);
    Singleton& operator=(const Singleton&);
};

int main() {
    Singleton& s1 = Singleton::getInstance();
    Singleton& s2 = Singleton::getInstance();

    if (&s1 == &s2) {
        std::cout << "s1 and s2 are the same instance\n";
    }

    return 0;
}
