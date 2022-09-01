//
// Created by Jollu Emil on 8/31/22.
//

#include <iostream>
using namespace std;

/* Link list node */
struct Node {
    int data;
    struct Node* next;
    Node(int data)
    {
        this->data = data;
        next = NULL;
    }
};

struct LinkedList {
    Node* head;
    LinkedList()
    {
        head = NULL;
    }



    /* Function to print linked list */
    void print()
    {
        struct Node* temp = head;
        while (temp != NULL) {
            cout << temp->data << " ";
            temp = temp->next;
        }
    }

    void push(int data)
    {
        Node* temp = new Node(data);
        temp->next = head;
        head = temp;
    }
};

/* Driver program to test above function*/
//int main()
//{
//    /* Start with the empty list */
//    LinkedList ll;
//    ll.push(20);
//    ll.push(4);
//    ll.push(15);
//    ll.push(85);
//
//    cout << "Given linked list\n";
//    ll.print();
//
//
//
//    cout << "\nReversed Linked list \n";
//    ll.print();
//    return 0;
//}
