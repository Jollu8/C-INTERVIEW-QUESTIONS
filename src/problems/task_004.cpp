//
//// Created by @Jollu8  on 5/16/24.
//

#include <iostream>
#include <vector>
#include <cassert>
#include <algorithm>
#include <map>
#include <queue>

using namespace std;
////  @Solution_meeting1
//// Задача — определить, сможет ли человек присутствовать на всех запланированных встречах без каких-либо совпадений. Точнее, две встречи не могут происходить одновременно. Человек может присутствовать на всех собраниях только в том случае, если из любых двух собраний одно заканчивается раньше начала другого.
//// intervals = [[0, 30], [5, 10], [15, 20]] -> @false

/// @Solution_meeting2_1 @Solution_meeting2_2
/// Дан массив интервалов встреч, нужно вернуть минимальное количество переговорок, необходимое для проведения всех встреч
/// int minMeetingRooms(vector<vector<int>>& intervals)
/// Примечание: если одна встреча заканчивается в 10 минут, а вторая в 10 начинается, то для этого нужно две переговорки, т.е интервалы заданы так, что начала и конец должны быть включены
/// {{0,30},{5,10},{15,20}} --> 2


//// @class
class Solution_meeting1 {
public:
    bool canAttendMeetings(std::vector<std::vector<int>> &A) {
        sort(A.begin(), A.end(), [](auto &a, auto &b) { return a[0] < b[0]; });
        for (int i = 1; i < A.size(); ++i)
            if (A[i][0] < A[i - 1][1]) return false;
        return true;
    }
};

//// @class
class Solution_meeting2_1{
public:
    int minMeetingRooms(vector<vector<int>> &A) {
        map<int, int> mp;
        for (auto &v: A) {
            ++mp[v[0]];
            --mp[v[1]];
        }
        int ans{}, cnt {};
        for (auto &[a, b]: mp) ans = max(ans, cnt += b);
        return ans;
    }
};

//// @class
class Solution_meeting2_2 {
public:
    int minMeetingRooms(vector<vector<int>>& A) {
        sort(A.begin(), A.end(), [](auto &a, auto &b) {return a[0] < b[0];});
        priority_queue<int,vector<int>, greater<>> pq;
        pq.push(A[0][1]);
        for(auto i = 1; i < A.size(); ++i) {
            if(A[i][0]  > pq.top()) pq.pop();
            pq.push(A[i][0]);
        }
        return pq.size();
    }
};

void test_meeting2();
void test_meeting1();

int main() {
    test_meeting1();
    std::cout << "Solution_meeting1 OK!\n";
    test_meeting2();
    std::cout << "Solution_meeting2 OK!\n";
}

void test_meeting2() {
    Solution_meeting2_1 s_1;
    Solution_meeting2_2 s_2;
    vector<vector<int>> v1{{1, 4}, {2, 5}, {7, 9}};
    vector<vector<int>> v2 {{0,30},{5,10},{15,20}};
    vector<vector<int>> v3{{7,10},{2,4}};
    assert(s_1.minMeetingRooms(v1) == 2);
    assert(s_1.minMeetingRooms(v2) == 2);
    assert(s_1.minMeetingRooms(v3) == 1);
    assert(s_2.minMeetingRooms(v3) == 1);
    assert(s_2.minMeetingRooms(v2) == 2);
    assert(s_2.minMeetingRooms(v1) == 2);


}

void test_meeting1() {
    Solution_meeting1 s_1;
    // Пример 1: Проверка встреч, которые не пересекаются
    vector<vector<int>> intervals1 = {{0, 1},
                                      {2, 3},
                                      {4, 5}};
// Ожидаемый вывод: true, так как все встречи могут проходить параллельно
    assert(s_1.canAttendMeetings(intervals1) == true);


// Пример 2: Проверка встреч, которые пересекаются
    vector<vector<int>> intervals2 = {{0, 1},
                                      {1, 2},
                                      {2, 3}};
// Ожидаемый вывод: false, так как одна встреча начинается до окончания предыдущей
    assert(s_1.canAttendMeetings(intervals2) == true);


// Пример 3: Проверка встреч, которые пересекаются
    vector<vector<int>> intervals3 = {{1, 2},
                                      {2, 3},
                                      {3, 4}};
// Ожидаемый вывод: true, так как одна встреча начинается до окончания предыдущей
    assert(s_1.canAttendMeetings(intervals3) == true);


// Пример 4: Одинаковые временные интервалы
    vector<vector<int>> intervals4 = {{1, 5},
                                      {1, 5},
                                      {1, 5}};
// Ожидаемый вывод: false, так как встречи проходят в одно время
    assert(s_1.canAttendMeetings(intervals4) == false);

// Пример 5: Проверка пустого массива
    vector<vector<int>> intervals5;
// Ожидаемый вывод: true, так как нет встреч
    assert(s_1.canAttendMeetings(intervals5));

// Пример 6: Проверка непрерывных временных интервалов
    vector<vector<int>> intervals6 = {{0,  5},
                                      {5,  10},
                                      {10, 15}};
// Ожидаемый вывод: true, так как встречи проходят одна за другой
    assert(s_1.canAttendMeetings(intervals6) == true);

// Пример 7: Проверка встреч, которые пересекаются
    vector<vector<int>> intervals7 = {{0, 5},
                                      {3, 8},
                                      {6, 10}};
// Ожидаемый вывод: false, так как одна встреча начинается до окончания предыдущей
    assert(s_1.canAttendMeetings(intervals7) == false);

// Пример 8: Проверка случая, когда все встречи пересекаются
    vector<vector<int>> intervals8 = {{1, 3},
                                      {2, 4},
                                      {3, 5},
                                      {4, 6}};
// Ожидаемый вывод: false, так как все встречи накладываются друг на друга
    assert(s_1.canAttendMeetings(intervals8) == false);

// Пример 9: Проверка случая, когда все встречи проходят одновременно
    vector<vector<int>> intervals9 = {{0, 1},
                                      {0, 1},
                                      {0, 1}};
// Ожидаемый вывод: false, так как встречи проходят в одно время
    assert(s_1.canAttendMeetings(intervals9) == false);

// Пример 10: Тестирование большого количества встреч
    vector<vector<int>> intervals10 = {{0,  1},
                                       {2,  3},
                                       {4,  5},
                                       {6,  7},
                                       {8,  9},
                                       {10, 11},
                                       {12, 13},
                                       {14, 15}};
// Ожидаемый вывод: true, так как все встречи могут проходить параллельно
    assert(s_1.canAttendMeetings(intervals10) == true);
}
