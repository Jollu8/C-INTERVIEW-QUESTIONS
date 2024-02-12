#include <iostream>

#define DEBUG // Определение макроса DEBUG

int main() {
#ifdef DEBUG // Если макрос DEBUG определен...
    std::cout << "Debug mode is ON" << std::endl; // ...выводим сообщение о том, что режим отладки включен
#else // В противном случае...
    std::cout << "Debug mode is OFF" << std::endl; // ...выводим сообщение о том, что режим отладки выключен
#endif

    return 0;
}

