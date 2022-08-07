//
// Created by jollu on 07.08.22.
//

template<typename T>
class Foo {
    T t_;
public:

    explicit Foo(T &t1) : t_(t1) {}

};

int main() {
    Foo<int> foo{5};
}