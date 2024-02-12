#include <iostream>
class Animal {
public:
    virtual void makeSound() = 0; // чисто виртуальная функция
};

class Cat : public Animal {
public:
    void makeSound() override { // переопределение чисто виртуальной функции
        std::cout << "Meow" << std::endl;
    }
};

class Dog : public Animal {
public:
    void makeSound() override {
        std::cout << "Woof" << std::endl;
    }
};

class Bird : public Animal {
public:
    void makeSound() override {
        std::cout << "Chirp" << std::endl;
    }
};

int main() {
    Animal* animals[] = {new Cat(), new Dog(), new Bird()};
    for (Animal* animal : animals) {
        animal->makeSound();
    }
    return 0;
}
