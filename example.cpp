#include <vector>
#include <iostream>
#include <queue>
#include <stack>

#include <iostream>

using namespace std;

struct Node {
    int val;
    std::vector<Node *> children;

    Node() {
        val = 0;
    }

    Node(int n, int d): val(d), children(n, nullptr) {
    }
};

void inorder(Node *h) {
    if (!h) return;

    for (auto &i: h->children) {
        inorder(i);
    }
    std::cout << h->val << " ";
}

void preorder(Node *root) {
    stack<Node *> s;
    vector<int> pre;
    s.push(root);

    while (!s.empty()) {
        Node *temp = s.top();
        s.pop();
        pre.push_back(temp->val);
        for (auto *i: temp->children) {
            if (i)
                s.push(i);
        }
    }
    for (auto &i: pre) {
        std::cout << i << " ";
    }
}

void post_stack(Node *root, vector<int> &ans) {
    stack<Node*> s;
    s.push(root);
    while(!s.empty()) {
        auto temp = s.top();
        s.pop();
        ans.push_back(root->val);
        for(auto *n : temp->children) if(n) s.push(n);
    }
}


class Solution {
    [[maybe_unused]] vector<int> preorder_loop(Node *root) {
        if (!root) return {};
        vector<int> ans;
        stack<Node *> s;
        s.push(root);
        while (!s.empty()) {
            auto *temp = s.top();
            s.pop();
            ans.push_back(temp->val);
            auto it = temp->children.rbegin();
            for (; it != temp->children.rend(); ++it) {
                if (*it)
                    s.push(*it);
            }
        }
        return ans;
    }

    void preorder_recur(Node *root, vector<int> &ans) {
        if(!root) return;

        ans.push_back(root->val);
        for(auto *n : root->children) preorder_recur(n, ans);
    }

public:
    vector<int> preorder(Node *root) {
        if (!root) return {};
    }
};





int main() {
   std::cout  << std::max({1,3,-5,7}) + std::min({-3,6,-8,-1}) + std::abs(-17);
}
