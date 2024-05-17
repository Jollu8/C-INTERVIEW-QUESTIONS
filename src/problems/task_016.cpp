//// Created by @Jollu8  on 5/17/24.
//// Description https://leetcode.com/problems/evaluate-reverse-polish-notation/description/
//// @Solution_1

#include <vector>
#include <unordered_map>
#include <functional>
#include <string>
#include <stack>

using namespace std;
using namespace std::string_literals;

class Solution {
public:
    int evalRPN(vector<string> &S) {
        unordered_map<char, function<int(int, int)>> func{
                {'+', [](int a, int b) { return a + b; }},
                {'-', [](int a, int b) { return a - b; }},
                {'*', [](int a, int b) { return a * b; }},
                {'/', [](int a, int b) { return a / b; }}
        };
        stack<int> st;

        for (auto &c: S) {
            if (!isdigit(c.back())) {
                auto b = st.top();st.pop();
                auto a = st.top();st.pop();
                st.push(func[c.back()](a, b));
            } else st.push(stoi(c));
        }
        return st.top();
    }
};

#define S size()
#define PB push_back

class Solution_1 {
public:
    int evalRPN(vector<string> &t) {
        vector<int> st;
        unordered_map<char, function<int(int, int)>> ops{
                {'+', [](int a, int b) { return a + b; }},
                {'-', [](int a, int b) { return a - b; }},
                {'*', [](int a, int b) { return a * b; }},
                {'/', [](int a, int b) { return a / b; }}
        };
        for (auto i: t) {
            if (ops.count(i.back())) {
                int a = st.back();
                st.pop_back();
                int b = st.back();
                st.pop_back();
                st.PB(ops[i.back()](b, a));
            } else {
                st.PB(stoi(i));
            }
        }
        return st.back();
    }
};



