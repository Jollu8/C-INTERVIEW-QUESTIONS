//// Created by @Jollu8  on 5/18/24.
//// Description https://leetcode.com/problems/reverse-linked-list/
//// @Solution_3 , @Solution_1 , @Solution_2

#include <algorithm>

using namespace std;


struct ListNode {
    int val;
    ListNode *next;

    ListNode() : val(0), next(nullptr) {}

    ListNode(int x) : val(x), next(nullptr) {}

    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

//// @class
class Solution_2 {
public:
    ListNode *reverseList(ListNode *h, ListNode *p = nullptr) {
        for(; h; swap(p, h->next), swap(p, h));
        return p;
    }
};

//// @class
class Solution_1 {
public:
    ListNode *reverseList(ListNode *h) {
        if (!h) return h;
        ListNode *p = nullptr;
        while (h) {
            swap(p, h->next);
            swap(p, h);
        }
        return p;
    }
};

//// @class
class Solution_3 {
public:
    ListNode *reverseList(ListNode *h) {
        if (!h) return h;
        ListNode *p = nullptr, *n;
        while (h) {
            n = h->next;
            h->next = p;
            p = h;
            h = n;
        }
        return p;
    }
};