#include <iostream>
#include <string>

class PizzaBuilder {
public:
    virtual ~PizzaBuilder() {}
    virtual void buildDough() = 0;
    virtual void buildSauce() = 0;
    virtual void buildTopping() = 0;
};

class HawaiianPizzaBuilder : public PizzaBuilder {
public:
    void buildDough() { std::cout << "Hawaiian pizza dough\n"; }
    void buildSauce() { std::cout << "Hawaiian pizza sauce\n"; }
    void buildTopping() { std::cout << "Hawaiian pizza topping\n"; }
};

class SpicyPizzaBuilder : public PizzaBuilder {
public:
    void buildDough() { std::cout << "Spicy pizza dough\n"; }
    void buildSauce() { std::cout << "Spicy pizza sauce\n"; }
    void buildTopping() { std::cout << "Spicy pizza topping\n"; }
};

class Cook {
public:
    void setPizzaBuilder(PizzaBuilder* builder) { this->builder = builder; }
    void constructPizza() {
        builder->buildDough();
        builder->buildSauce();
        builder->buildTopping();
    }
private:
    PizzaBuilder* builder;
};

int main() {
    Cook cook;
    HawaiianPizzaBuilder hawaiianPizzaBuilder;
    SpicyPizzaBuilder spicyPizzaBuilder;

    cook.setPizzaBuilder(&hawaiianPizzaBuilder);
    cook.constructPizza();

    cook.setPizzaBuilder(&spicyPizzaBuilder);
    cook.constructPizza();

    return 0;
}
