//
// Created by jollu .
//

#include <iostream>
#include <string>

class Base {
public:
    Base(const std::string &str) {
        createView(str);
    }

    void createView(const std::string &str) {
        std::cout << str << "\n";
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    Derived() :
            Base("Derived View") {}
};

//int main() {
//    Base *p = new Derived();
//    delete p;
//}