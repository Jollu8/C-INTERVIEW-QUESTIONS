//
// Created by jollu .
//

#include <iostream>

class Base {
public:
    template<class T>
    static T *construct() {
        T *t = new T;
        t->createView();
        return t;
    }

    virtual void createView() {
        std::cout << "Base View\n";
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    virtual void createView() override {
        std::cout << "Derived View\n";
    }
};
//
//int main() {
//    Base *p = Base::construct<Derived>();
//    delete p;
//}
