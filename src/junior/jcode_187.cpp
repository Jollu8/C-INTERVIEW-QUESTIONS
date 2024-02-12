#include <iostream>
#include <algorithm>
using namespace std;

template <typename T>
class MyVector {
public:
    MyVector() : data(nullptr), sz(0), capacity(0) {}
    ~MyVector() { delete[] data; }
    void push_back(const T& value) {
        if (sz == capacity) {
            resize();
        }
        data[sz++] = value;
    }
    void push_front(const T& value) {
        if (sz == capacity) {
            resize();
        }
        for (int i = sz; i > 0; i--) {
            data[i] = data[i - 1];
        }
        data[0] = value;
        sz++;
    }
    void pop_back() {
        if (sz > 0) {
            sz--;
        }
    }
    void pop_front() {
        if (sz > 0) {
            for (int i = 0; i < sz - 1; i++) {
                data[i] = data[i + 1];
            }
            sz--;
        }
    }
    int size() const { return sz; }
    void clear() { sz = 0; }
private:
    T* data;
    int sz;
    int capacity;
    void resize() {
        capacity = max(1, capacity * 2);
        T* newData = new T[capacity];
        for (int i = 0; i < sz; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }
};

int main() {
    MyVector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    cout << "Размер: " << v.size() << endl;
    v.pop_back();
    cout << "Размер: " << v.size() << endl;
    v.push_front(4);
    cout << "Размер: " << v.size() << endl;
    v.pop_front();
    cout << "Размер: " << v.size() << endl;
    v.clear();
    cout << "Размер: " << v.size() << endl;
    return 0;
}
