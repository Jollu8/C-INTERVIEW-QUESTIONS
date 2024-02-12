#include <iostream>

#define PI 3.14 // Определение макроса PI со значением 3.14
#define SQUARE(x) ((x)*(x)) // Определение макроса SQUARE, который возвращает квадрат своего аргумента

int main() {
    std::cout << "The value of PI is: " << PI << std::endl; // Использование макроса PI
    std::cout << "The square of 5 is: " << SQUARE(5) << std::endl; // Использование макроса SQUARE

    return 0;
}
