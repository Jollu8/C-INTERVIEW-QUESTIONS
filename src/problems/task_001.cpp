//
//// Created by Jollu8 on 5/15/24.
//

////- Нерекурсивно удалить смайлики вида :-)) и :-(( из строки
////string EraseSmiles (const string& input);
/// "eg:-))g)" --> "egg)"
/// "e:-:-))))" --> "e:-))"

#include <string>
#include <iostream>

using namespace std;
using namespace std::string_literals;

string EraseSmiles(const string &s) {
    string ans;
    for (int i = 0; i < s.size(); ++i) {
        if (i + 3 < s.size() && s[i] == ':' && (s.substr(i + 1, 3) == "-))"s || s.substr(i + 1, 3) == "-(("s))
            i += 3;
        else ans += s[i];
    }
    return ans;
}

int main() {
    const std::string s = "e:-:-))))"s;
    std::cout << EraseSmiles(s);

}

