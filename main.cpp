#include <fstream>
#include <string>
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <memory>

class ListNode
{
public:
int val;
ListNode *next;

~ListNode()
{
}

};


std::shared_ptr<ListNode> createListNode(int digit)
{
    std::string dig = std::to_string(digit);

    std::shared_ptr<ListNode> listNode = std::make_shared<ListNode>();
    ListNode * ln = listNode.get();

    for(int i = dig.size() - 1; i >= 0; i--)
    {
        ln->val = dig[i] - '0';

        if(i != 0)
        {
            ln->next = new ListNode();
            ln = ln->next;
        }
        else ln->next = nullptr;
    }

    return listNode;
}

int main() {
    int a  = 19;
    int b = 17;
    int max = (a > b) ? a : b;
    int res;
    for (;;) {
        if (max % a == 0 && max % b == 0) {
            res = max;
            break;
        }
        max++;
    }
    std::cout << res;
}