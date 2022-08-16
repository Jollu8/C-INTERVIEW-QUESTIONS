//
// Created by jollu .
//

#include <iostream>
#include <memory>

class Base {
public:
    Base() = default;

    virtual void createView() {
        std::cout << "Base View\n";
    }

    virtual ~Base() = default;
};

class Derived : public Base {
public:
    Derived() :
            Base() {}

    void createView() override {
        std::cout << "Derived View\n";
    }
};

template<class Letter>
class Envelope : public Base {
    std::unique_ptr<Letter> _letter;
public:
    Envelope() :
            Base(),
            _letter(new Letter) {
        _letter->createView();
    }

    void createView() override {
        _letter->createView();
    }

    ~Envelope() {}
};

//int main() {
//    Base *p = new Envelope<Derived>();
//    delete p;
//}
