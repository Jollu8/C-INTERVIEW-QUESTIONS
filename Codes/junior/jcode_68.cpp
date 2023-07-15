#include <iostream>
class MyClass {
public:
    int x;
    mutable int y;

    void constMethod() const {
        // x = 10; // ошибка: изменение неизменяемого поля-переменной в константном методе недопустимо
        y = 20; // допустимо: изменение изменяемого поля-переменной в константном методе
    }
};

int main() {
    const MyClass obj {};
    obj.constMethod(); // допустимо: вызов константного метода для константного объекта
    std::cout << obj.y << std::endl; // вывод значения изменяемого поля-переменной (20)
    return 0;
}
