//// Created by @Jollu8 on 5/16/24.
//// Desciption https://leetcode.com/problems/find-the-duplicate-number/description/
//// @Solution_1 , @Solution_2 , @Solution_3

#include <unordered_set>
#include <vector>

using namespace std;

//// @class
class Solution_1 {
public:
    int findDuplicate(vector<int> &n) {
        unordered_set<int> s;
        s.reserve(n.size());
        for (auto i: n) {
            if (!s.contains(i))s.insert(i);
            else return i;
        }
        return 42;
    }
};

class Solution_2 {
public:
    int findDuplicate(vector<int> &A) {
        int slow = A[0], fast = A[0];
        do {
            slow = A[slow];
            fast = A[A[fast]];
        } while (slow != fast);

        slow = A[0];
        while (slow != fast) slow = A[slow], fast = A[fast];
        return slow;
    }
};


class Solution_3 {
public:
    int findDuplicate(vector<int> &A) {
        vector<int> seen(A.size() + 1);
        for (auto i: A) if (++seen[i] > 1)return i;
        return 42;
    }
};
