#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <unordered_set>
#include <bitset>


bool is_alpha(std::string &s) {
    for (auto i: s) {
        if (!isdigit(i)) return false;
    }
    return true;
}

int size_unique(std::vector<std::string> &vec) {
    std::unordered_set<char> res;
    for (auto i = 0; i < 3; i++) {
        for (auto it: vec[i]) {
            res.insert(it);
        }
    }
    return res.size();
}

int count_birth(std::string &s1, std::string &s2) {
    int count = 0;
    for (auto i: s1) {
        count += i - '0';
    }
    for (auto i: s2) count += i - '0';
    return count;
}

int main() {
    std::ifstream iFile("./input.txt");
    std::string getInputFile;
    std::vector<std::vector<std::string >> tokens;

    std::string res;

    while (iFile >> getInputFile) {
        if (getInputFile.size() < 3) continue;


        std::istringstream ss{std::move(getInputFile)};
        std::string s;
        std::vector<std::string> vec;
        while (getline(ss, s, ',')) {
            vec.push_back(s);
        }
        int sizeB = count_birth(vec[3], vec[4]);
        int countUniqueFullName = size_unique(vec);
        int size_ch = tolower(vec[0][0]) - 'a' + 1;
        int resAll = countUniqueFullName + (sizeB * 64) + (size_ch * 256);

        std::stringstream convertHex;
        convertHex << std::hex << resAll;
        std::string str;
        convertHex >> str;
        int sizeSTR = str.size() - 3;
        std::string stringAfterSStream;
        for(auto i = sizeSTR; i < str.size(); i++) {
            if(isalpha(str[i])) stringAfterSStream += toupper(str[i]);
            else stringAfterSStream += str[i];
        }
        if(res.empty()) {
            res = stringAfterSStream;
        }else {
            res += " " + stringAfterSStream;
        }


    }
    iFile.close();


    std::ofstream outFile("./output.txt");

    outFile << res;
    outFile.close();
}
