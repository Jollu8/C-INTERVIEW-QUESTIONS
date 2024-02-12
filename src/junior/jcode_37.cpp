#include <stdio.h>

int main(void) {
    int x = 5; // 00000101
    int y = 3; // 00000011

    printf("x & y = %d\n", x & y); // 00000001
    printf("x | y = %d\n", x | y); // 00000111
    printf("x ^ y = %d\n", x ^ y); // 00000110
    printf("~x = %d\n", ~x); // 11111010
    printf("x << 1 = %d\n", x << 1); // 00001010
    printf("x >> 1 = %d\n", x >> 1); // 00000010

    return 0;
}
