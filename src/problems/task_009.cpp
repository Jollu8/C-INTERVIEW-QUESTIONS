//// Created by @Jollu8  on 5/17/24.



//// @Solution_1, @Solution_2 https://leetcode.com/problems/recover-binary-search-tree/description/
/// Дано бинарное дерево поиска, в нём взяли два разных узла и поменяли значения местами. Нужно поменять значения обратно
/// void recoverTree(TreeNode* root)
///      3           1
///     /           /
///    1     -->   3
///     \           \
///      2           2

#include <iostream>
#include <vector>
#include <unordered_set>
#include <cassert>


using namespace std;


struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;

    TreeNode() : val(0), left(nullptr), right(nullptr) {}

    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}

    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

//// @class
class Solution_1 {
    vector<TreeNode *> p;

    void dfs(TreeNode *r) {
        if (!r) return;
        dfs(r->left);
        if (p[0] && p[0]->val > r->val) {
            if (!p[1]) p[1] = p[0];
            p[2] = r;
        }
        p[0] = r;
        dfs(r->right);
    }

public:
    Solution_1() : p(vector<TreeNode *>(3, nullptr)) {}

    void recoverTree(TreeNode *r) {
        dfs(r);
        if (p[1] && p[2])
            swap(p[1]->val, p[2]->val);
    }
};

class Solution_2 {

public:
    void recoverTree(TreeNode *root) {
        vector<TreeNode *> p(3, nullptr);
        function<void(TreeNode *)> inor = [&](TreeNode *r) {
            if (!r) return;
            inor(r->left);
            if (p[0] && p[0]->val > r->val) {
                if (!p[1])p[1] = p[0];
                p[2] = r;
            }
            p[0] = r;
            inor(r->right);
        };
        inor(root);
        if (p[1] && p[2])
            swap(p[1]->val, p[2]->val);
    }
};
