#include <iostream>
#include <string>

class MyClass {
public:
    // Конструктор по умолчанию
    MyClass() {
        std::cout << "Default constructor\n";
    }

    // Конструктор с параметрами
    MyClass(int x) : x(x) {
        std::cout << "Parameterized constructor\n";
    }

    // Конструктор копирования
    MyClass(const MyClass& other) : x(other.x) {
        std::cout << "Copy constructor\n";
    }

    // Конструктор перемещения
    MyClass(MyClass&& other) : x(other.x) {
        std::cout << "Move constructor\n";
    }

private:
    int x;
};

int main() {
    MyClass a; // вызов конструктора по умолчанию
    MyClass b(10); // вызов конструктора с параметрами
    MyClass c(b); // вызов конструктора копирования
    MyClass d(std::move(c)); // вызов конструктора перемещения

    return 0;
}
