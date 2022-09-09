//
// Created by Jollu Emil on 9/2/22.
//


#include <iostream>
#include <cmath>

class Node {
public:
    int data_;
    Node *left_;
    Node *right_;

    Node(int d) {
        int data = d;
        left_ = right_ = NULL;
    }
};

int height(Node * node) {
    if(node == NULL) return 0;

    return 1 + std::max(height(node->left_), height(node->right_));
}

bool is_balanced(Node*node) {
    int lhs;
    int rhs;
    if(node == NULL) return 1;

    lhs = height(node->left_);
    rhs = height(node->right_);

    if(std::abs(lhs - rhs) <= 1 && is_balanced(node->left_) && is_balanced(node->right_)) return 1;
    return 0;
}

int main() {
    Node* root = new Node(1);
    root->left_ = new Node(2);
    root->right_ = new Node(3);
    root->left_->left_ = new Node(4);
    root->left_->right_ = new Node(5);
    root->left_->left_->left_ = new Node(8);

    if (is_balanced(root))
        std::cout << "Tree is balanced";
    else
        std::cout << "Tree is not balanced";
    return 0;
}