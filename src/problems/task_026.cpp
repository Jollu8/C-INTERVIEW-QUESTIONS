//// Created by @Jollu8  on 5/18/24.
//// Description https://leetcode.com/problems/valid-parentheses/

#include <stack>
#include <string>

using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;

        for (auto c: s) {
            if (c == '(' || c == '{' || c == '[')st.push(c);
            else {
                if (st.empty()) return false;
                auto t = st.top();
                st.pop();
                if (t == '[' && c != ']' ||
                    t == '{' && c != '}' ||
                    t == '(' && c != ')')
                    return false;
            }
        }
        return st.empty();
    }
};
