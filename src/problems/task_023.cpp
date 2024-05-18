//// Created by @Jollu8  on 5/18/24.
//// Description 125. Valid Palindrome

#include <vector>
#include <string>

using namespace std;
using namespace std::string_literals;

class Solution {
public:
    bool isPalindrome(string s) {
        for(int l{}, r = s.size()-1; l <=r; ++l, --r) {
            if(!isalnum(s[r]))--l;
            else if(!isalnum(s[l]))++r;
            else if(tolower(s[l]) != tolower(s[r])) return false;
        }
        return true;
    }
};
