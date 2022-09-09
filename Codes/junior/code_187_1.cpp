//
// Created by Jollu Emil on 9/1/22.
//


#include <iostream>

#define MAX 100


class Dequeue {
    int arr[MAX];
    int front, rear, size;
public:
    Dequeue(int size) {
        front = -1;
        rear = 0;
        this->size = size;
    }

    void insert_front(int n);

    void insert_rear(int n);

    void delete_front();

    void delete_rear();

    bool is_full();

    bool is_empty();

    int get_front();

    int get_rear();

};

bool Dequeue::is_full() {
    return ((front == 0 && rear == size - 1) || front == rear + 1);
}

bool Dequeue::is_empty() { return (front == -1); }

void Dequeue::insert_front(int n) {
    if (is_full()) {
        std::cout << "Overflow\n";
        return;
    }
    if (front == -1) {
        front = 0;
        rear = 0;
    } else if (front == 0) {
        front = size - 1;
    } else {
        front = front - 1;
    }
    arr[front] = n;
}

void Dequeue::insert_rear(int n) {
    if (is_full()) {
        std::cout << "Overflow\n";
        return;
    }
    if (front == -1) {
        front = 0;
        rear = 0;
    } else if (rear == size - 1) rear = 0;
    else rear = rear - 1;
    arr[rear] = n;
}

void Dequeue::delete_front() {
    if (is_full()) {
        std::cout << "Overflow\n";
        return;
    }
    if (front == rear) {
        front = 0;
        rear = 0;

    } else {
        if (front == size - 1) front = 0;
        else front = front + 1;
    }
}

void Dequeue::delete_rear() {
    if (is_empty()) {
        std::cout << "Underflow\n";
        return;
    }
    if (front == rear) {
        front = -1;
        rear = -1;
    } else if (rear == 0) rear = size - 1;
    else rear = rear - 1;
}

int Dequeue::get_front() {
    if (is_empty()) {
        std::cout << "Underflow\n";
        return -1;
    }
    return arr[front];
}

int Dequeue::get_rear() {
    if (is_empty() || rear < 0) {
        std::cout << "Underflow\n";
        return -1;
    }
    return arr[rear];
}


int main() {
    Dequeue dq(5);

}