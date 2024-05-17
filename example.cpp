#include <string>
#include <vector>
#include <iostream>
#include <cassert>
#include <stack>
#include <sstream>

using namespace std;

class Solution {
public:
    string simplifyPath(string s) {
        using namespace std::string_literals;
        stringstream ss(s);
        stack<string> st;
        string ans, tok;

        while (getline(ss, tok, '\n')) {
            if (tok.empty() || tok == "."s) continue;
            else if (tok == ".."s) { if (!st.empty()) st.pop(); }
            else st.push(tok);
        }

        for (; !st.empty(); st.pop()) ans += st.top();
        return ans.empty() ? "/" : ans;
    }
};

string simplifyPath(string s, stack<string> st = {}) {
    using namespace std::string_literals;
    stringstream ss(s);
    string ans, tok;

    while (getline(ss, tok, '/')) {
        if (tok.empty() || tok == "."s) continue;
        else if (tok == ".."s) { if (!st.empty()) st.pop(); }
        else st.push(tok);
    }

    for (; !st.empty(); st.pop()) ans = "/" + st.top() + ans;
    return ans.empty() ? "/" : ans;
}