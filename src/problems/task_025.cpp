//// Created by @Jollu8  on 5/18/24.
//// Description https://leetcode.com/problems/validate-binary-search-tree/

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;

    TreeNode() : val(0), left(nullptr), right(nullptr) {}

    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}

    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
                                                       right(right) {}
};

class Solution {
public:
    bool isValidBST(TreeNode *root, TreeNode *l = {}, TreeNode *r = {}) {
        if (!root) return true;
        if (l && l->val >= root->val || r && r->val <= root->val) return false;
        return isValidBST(root->left, l, root) && isValidBST(root->right, root, r);
    }
};

