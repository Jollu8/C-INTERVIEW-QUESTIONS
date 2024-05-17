
//// Created by @author Jollu8  on 5/17/24.

//// @Solution
/// Дан односвязный список и числа l и r, l <= r. Нужно развернуть список с l по r включительно. В l и r используется отсчёт с 1. Гарантируется, что l и r не могут выйти за границы
/// Количество узлов в списке >= 1
/// 1 -> 2 -> 3 -> 4 -> 5 [2, 4] ---> 1 -> 4 -> 3 -> 2 -> 5

#include <iostream>
#include <cassert>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;

    ListNode() : val(0), next(nullptr) {}

    explicit ListNode(int x) : val(x), next(nullptr) {}

    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

/// @class
class Solution {
public:
    ListNode *reverseFromLtoR(ListNode *h, int l, int r) {
        if (!h)return h;
        auto dummy = new ListNode(0);
        dummy->next = h;
        auto pre = dummy;
        for (int i = 1; i < l; ++i) pre = pre->next;
        h = pre->next;

        for (int i = l; i < r; ++i) {
            auto next = h->next;
            h->next = next->next;
            next->next = pre->next;
            pre->next = next;
        }
        return dummy->next;
    }
};

void printList(ListNode *head);

int main() {
    Solution solution;

    // Тест 1
    std::cout << "Test 1\n";
    auto *head1 = new ListNode(1);
    head1->next = new ListNode(2);
    head1->next->next = new ListNode(3);
    head1->next->next->next = new ListNode(4);
    head1->next->next->next->next = new ListNode(5);
    ListNode *result1 = solution.reverseFromLtoR(head1, 2, 4);
    printList(result1);  // Ожидаемый вывод: 1 -> 4 -> 3 -> 2 -> 5

    // Тест 2
    std::cout << "Test 2\n";
    auto *head2 = new ListNode(1);
    head2->next = new ListNode(2);
    head2->next->next = new ListNode(3);
    ListNode *result2 = solution.reverseFromLtoR(head2, 1, 2);
    printList(result2);  // Ожидаемый вывод: 2 -> 1 -> 3

    // Тест 3
    std::cout << "Test 3\n";
    auto *head3 = new ListNode(1);
    auto *result3 = solution.reverseFromLtoR(head3, 1, 1);
    printList(result3);  // Ожидаемый вывод: 1

    // Тест 4
    std::cout << "Test 4\n";
    auto *head4 = new ListNode(1);
    head4->next = new ListNode(2);
    head4->next->next = new ListNode(3);
    head4->next->next->next = new ListNode(4);
    head4->next->next->next->next = new ListNode(5);
    auto *result4 = solution.reverseFromLtoR(head4, 1, 5);
    printList(result4);  // Ожидаемый вывод: 5 -> 4 -> 3 -> 2 -> 1

    // Тест 5
    std::cout << "Test 5\n";
    auto *head5 = new ListNode(1);
    head5->next = new ListNode(2);
    head5->next->next = new ListNode(3);
    head5->next->next->next = new ListNode(4);
    head5->next->next->next->next = new ListNode(5);
    auto *result5 = solution.reverseFromLtoR(head5, 3, 3);
    printList(result5);  // Ожидаемый вывод: 1 -> 2 -> 3 -> 4 -> 5

    // Добавьте больше тестов по мере необходимости...

}


void printList(ListNode *head) {
    ListNode *temp = head;
    while (temp != nullptr) {
        std::cout << temp->val;
        if (temp->next != nullptr) {
            std::cout << " -> ";
        }
        temp = temp->next;
    }
    std::cout << std::endl;
}
