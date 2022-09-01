//
// Created by Jollu Emil on 8/31/22.
//

#include <iostream>
#include <iterator>
#include <vector>
#include <numeric>


template<typename T>
void reverse(T &begin, T &end) {
    using iter_cast = typename std::iterator_traits<T>::iterator_category;

    if constexpr (std::is_base_of_v<std::random_access_iterator_tag, iter_cast>) {
        if (begin == end) return;

        for (--end; begin < end; (void) ++begin, --end)
            std::iter_swap(begin, end);
    } else while ((begin != end) && (begin != --end)) std::iter_swap(begin++, end);
}

//int main() {
//    std::vector<int> vec(10);
//    std::iota(vec.begin(), vec.end(), 1);
//    reverse(vec.begin(), vec.end());
//    for (auto i: vec) std::cout << i << ' ';
//}