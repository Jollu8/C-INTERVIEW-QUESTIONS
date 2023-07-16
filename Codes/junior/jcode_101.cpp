
class Color;
class Animal {
public:
    virtual void eat();
    // ...
};

// Two classes virtually inheriting Animal:
class Mammal : public virtual Animal {
public:
    Color getHairColor();
   //  ...
};

class WingedAnimal : public virtual Animal {
public:
    void flap();
    // ...
};

// A bat is still a winged mammal
class Bat : public Mammal, public WingedAnimal {};
