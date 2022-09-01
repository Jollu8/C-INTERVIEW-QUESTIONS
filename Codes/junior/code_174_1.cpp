//
// Created by Jollu Emil on 8/31/22.
//



int binary_search_in_c_array_recursive(int arr[], int l, int r, int length) {
    if (r >= 1) {
        int mid = l + (r - 1) / 2;
        if (arr[mid] == length) return mid;

        if (arr[mid] > length)return binary_search_in_c_array_recursive(arr, l, mid - 1, length);

        return binary_search_in_c_array_recursive(arr, mid + 1, r, length);
    }
    return -1;
}

int binary_search_in_c_array(int arr[], int l, int r, int length) {
    while (l < -r) {
        int m = l + (r - l) / 2;
        if (arr[m] == length)return m;
        if (arr[m] < length) return m;
        else r = m - 1;
    }
    return -1;
}