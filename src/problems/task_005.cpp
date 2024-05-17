//// Created by @Jollu8 on 5/16/24.

/// нужно слова вернуть в обратном порядке, убрав пробелы с начала и конца предложения и между словами оставить только один пробел
//// @Solution_1 , @Solution (не работает)

#include <iostream>
#include <vector>
#include <cassert>
#include <algorithm>
#include <map>
#include <sstream>

using namespace std;

//// @class
class Solution_1 {
public:
    string reverseWords(string s) {
        string ans, tok;
        ans.reserve(s.size());
        stringstream ss(s);
        while (ss >> tok) ans = tok + " " + ans;

        ans.pop_back();
        return ans;
    }
};

//// @class
class Solution { // не умеет пробелы удалять
public:
    string reverseWords(string s) {
        reverse(s.begin(), s.end());
        for (int l{}, r{}; r < s.size(); ++r) {
            if (int cnt{}; s[r] == ' ') {
                while (r + 1 < s.size() && s[r + 1] == ' ')++r, ++cnt;
                reverse(s.begin() + l, s.begin() + r - cnt);
                l = r;
            }
            if (r + 1 == s.size() || r == s.size() - 1)
                reverse(s.begin() + l, s.end());
        }
        return s;
    }
};

void test();

int main() {
    test();
    std::cout << "OK!\n";
}

void test() {
    using namespace std::string_literals;
    Solution_1 s1;
//    Solution_2 s2;
    string str1 = "the sky is blue"s;
    string str2 = "  hello world  "s;
    string str3 = "a good   example"s;
    assert(s1.reverseWords(str1) == "blue is sky the"s);
    assert(s1.reverseWords(str2) == "world hello"s);
    assert(s1.reverseWords(str3) == "example good a"s);
//    assert(s2.reverseWords(str1) == "blue is sky the"s);
//    assert(s2.reverseWords(str2) == "world hello"s);
//    assert(s2.reverseWords(str3) == "example good a"s);
}
