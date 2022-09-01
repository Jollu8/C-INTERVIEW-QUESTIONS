//
// Created by Jollu Emil on 9/1/22.
//

#include <iostream>


int count_fib(int low, int high) {
    int f1 = 0, f2 = 1, f3 = 1;
    int result = 0;
    while (f1 <= high) {
        if (f1 >= low) result++;
        f1 = f2;
        f2 = f3;
        f3 = f1 + f2;
    }
    return result;
}

int main() {

    int low = 10;
    int high = 100;
    std::cout << count_fib(low, high);

}