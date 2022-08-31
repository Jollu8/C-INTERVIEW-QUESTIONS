//
// Created by Jollu Emil.
//

#include <iostream>
#include <string>
#include <bit>
#include <bitset>
#include <cstdint>

int count_one(double d) {
    auto ans_str = std::to_string(d);
    return std::count_if(ans_str.begin(), ans_str.end(), [](auto ch) { return ch - '0' == 1; });
}

//int main() {
//    double d = 12421211.23123123223;
//    std::cout << count_one(d) << "\n\n";
//
//    for (const std::uint8_t i: {0, 0b11111111, 0b01111111, 0b11100011}) {
//        std::cout << "countl_one( " << std::bitset<8>(i) << " ) = "
//                  << std::countl_one(i) << '\n';
//    }
//}