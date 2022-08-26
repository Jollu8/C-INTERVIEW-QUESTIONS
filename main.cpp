#include <iostream>
//#include <thread>
//#include <string>
#include <vector>



class Finder {
    std::vector<int> vec_;
public:
    Finder() : vec_() {}
    auto find(int n) {
        return std::find(vec_.begin(), vec_.end(), n);
    }

    auto add_element(int n) {
        vec_.push_back(n);
    }
    bool empty() {
        return vec_.empty() ? true : false;
    }
    int get_size() {
        return vec_.size();
    }
    void set_size(int n) {
        vec_.reserve(n);
    }
//    vec.erase(std::remove(vec.begin(), vec.end(), userinput), vec.end());
    auto remove_el(int n) {
        auto res = std::find(vec_.begin(), vec_.end(),n);
        if(res != vec_.end()) {
            vec_.erase(remove(vec_.begin(), vec_.end(), n), vec_.end());
            return true;
        } else
        return false;
    }
};

int main() {
    std::cout << "Enter size element:";
    int size_el;
    std::cin >> size_el;
    Finder finder;
    finder.set_size(size_el);
    int n = 0;
    while (n < size_el) {
        int element;
        std::cout <<"Enter element:";
        std::cin >> element;
        finder.add_element(element);
        n++;
    }

    while (!finder.empty()) {
        std::cout << "Enter element for erase:";
        int delete_element;
        std::cin >> delete_element;
        auto after_del_el = finder.remove_el(delete_element);
        if(after_del_el) std::cout << "Deleted " << delete_element << std::endl;
        else std::cout << "Not found" << std::endl;
    }
    std::cout << "Finder if empty!" <<std::endl;
}

