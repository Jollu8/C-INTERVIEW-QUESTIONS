#include <iostream>
#include <stack>
#include <queue>

int main() {
    std::stack<int> myStack;
    std::queue<int> myQueue;

    // Добавление элементов в стек
    myStack.push(1);
    myStack.push(2);
    myStack.push(3);

    // Извлечение элементов из стека
    while (!myStack.empty()) {
        std::cout << myStack.top() << ' ';
        myStack.pop();
    }
    std::cout << std::endl;

    // Добавление элементов в очередь
    myQueue.push(1);
    myQueue.push(2);
    myQueue.push(3);

    // Извлечение элементов из очереди
    while (!myQueue.empty()) {
        std::cout << myQueue.front() << ' ';
        myQueue.pop();
    }
    std::cout << std::endl;

    return 0;
}
