
#include <iostream>

// TODO: установите здесь ссылки на дополнительные заголовки, требующиеся для программы.

#include <string>
#include <vector>
#include <utility>
#include <chrono>
#include <iostream>
#include <fstream>

#include <iterator>    /** for ostream_iterator */
#include <stack>    /** for stack */
#include <queue>    /** for queue */
#include <cstring>  /** for strcpy() */










using namespace std;
using namespace chrono;


using write_sequence = vector<string>;

using test_pair = pair<uint64_t, string>;
using modify_sequence = vector<test_pair>;
using read_sequence = vector<test_pair>;

ifstream& operator >> (ifstream& _is, test_pair& _value)
{
    _is >> _value.first;
    _is >> _value.second;

    return _is;
}

template <typename S>
S get_sequence(const string& _file_name)
{
    ifstream infile(_file_name);
    S result;

    typename S::value_type item;

    while (infile >> item)
    {
        result.emplace_back(move(item));
    }

    return result;
}



class storage
{
public:

    static const uint64_t  Shirina_Massive = 128;


    //Node structure.
    struct TreeNode
    {
        char data[Shirina_Massive];              //data field
        TreeNode* l, * r;                        //left and right childs.

        TreeNode* parent;

        uint64_t LeftCounter;
        uint64_t RightCounter;

    };


    //Variables
    TreeNode* pRoot;          //pointer to the root of a tree
    uint64_t treeTotal;       //The number of nodes in the tree


    storage()
    {
        treeTotal = 0;
        pRoot = nullptr;

        cout << "DEBUG: Constructor called... " << endl;
    }/* storage()*/

    ~storage()
    {
        /** free allocated memory */
        cout << "DEBUG: Destructor called... " << endl;

        DeleteTree_no_recursive(pRoot);

        cout << "Our Binary Tree Removed From Memory:  treeTotal = " << treeTotal << endl << endl;

    }/*  ref. to ~storage() */

    void push_no_recursive(const char* a, TreeNode** troot)
    {
        TreeNode** t = troot;
        TreeNode* pParent = nullptr;

        while ((*t) != NULL) {

            if (strcmp(a, (*t)->data) < 0) {

                (*t)->LeftCounter++;
                pParent = (*t);

                t = &(*t)->l;
                continue;
            }
            else if (strcmp(a, (*t)->data) > 0) {

                (*t)->RightCounter++;
                pParent = (*t);

                t = &(*t)->r;
                continue;
            }

        }

        if ((*t) == NULL)
        {

            if (pRoot == nullptr) {
                (*t) = new TreeNode;
                strcpy((*t)->data, a);
                (*t)->l = (*t)->r = NULL;

                (*t)->parent = nullptr;
                (*t)->LeftCounter = 0;
                (*t)->RightCounter = 0;
                cout << "Starting initialization. " << "(*t)->data = " << (*t)->data << endl;
            }
            else {

                (*t) = new TreeNode;
                strcpy((*t)->data, a);
                (*t)->l = (*t)->r = NULL;

                (*t)->parent = pParent;

                (*t)->LeftCounter = 0;
                (*t)->RightCounter = 0;
            }
            treeTotal++;

            return;
        }

    }/*end of push_no_recursive() */



    /*
     *  Delete the tree,
     *  Uses queue to delete all the tree.
     */

    uint64_t DeleteTree_no_recursive(TreeNode* tRoot)
    {
        // Base Case
        if (tRoot == nullptr)
            return 0;

        // Create an empty queue for level order traversal
        queue<TreeNode*> q;

        // Do level order traversal starting from root
        q.push(tRoot);
        while (!q.empty())
        {
            TreeNode* node = q.front();
            q.pop();

            if (node->l != nullptr)
                q.push(node->l);
            if (node->r != nullptr)
                q.push(node->r);

            delete node;
        }

        return 0;
    }/*end  DeleteTree_no_recursive()*/



/*
 *   Can show tree's elements.
 *   Useful for debug purposes.
 *   InOrder Traversal.
 *
 */
    void Show_Simmetrich_no_recursive(TreeNode* troot)
    {
        stack<TreeNode* > s;
        TreeNode* curr = troot;

        uint64_t deb_cc = 0;
        while (curr != nullptr || s.empty() == false)
        {
            /* Reach the left most Node of the
               curr Node */
            while (curr != nullptr)
            {
                /* place pointer to a tree node on
                   the stack before traversing
                  the node's left subtree */
                s.push(curr);
                curr = curr->l;
            }

            /* Current must be nullptr at this point */
            curr = s.top();
            s.pop();


            if (curr->parent == nullptr) {
                cout << "curr ptr= " << curr << "  " << curr->data << "   index = " << deb_cc++ << "  curr->parent = " << "nullptr" << endl;
            }
            else {
                cout << "curr ptr= " << curr << "  " << curr->data << "   index = " << deb_cc++ << "  curr->parent = " << curr->parent << "  curr->parent->data = " << curr->parent->data << endl;
            }

            /* we have visited the node and its
               left subtree.  Now, it's right
               subtree's turn */
            curr = curr->r;

        } /* end of while */


    }/*end  Show_Simmetrich_no_recursive() */



/*
 *   SUPPORT INDICES.
 *   Delete node with current pointer _root
 *   and parent _prev.
 *
 */

    void delete_elem(TreeNode* _root, TreeNode* _prev)
    {
        TreeNode* curr = _root;
        TreeNode* prev = _prev;

        // Base case
        if (_root == nullptr) {
            return;
        }

        if (curr->l == nullptr && curr->r == nullptr) {    /**this is a leaf */

            if (prev != nullptr) {     /** if remains the last node in the tree - root node ( i.e. prev=nullptr). */

                if (curr == prev->l) {
                    prev->l = nullptr;
                }
                else if (curr == prev->r) {
                    prev->r = nullptr;
                }
                delete curr;
            }
            else {
                delete curr;
                pRoot = nullptr;
            }


        }/*ref. to if (curr->l == nullptr && curr->r == nullptr) */


            // Check if the node to be
            // deleted has at most one child.
        else if (curr->l == nullptr || curr->r == nullptr) {

            // newCurr will replace
            // the node to be deleted.
            TreeNode* newCurr;

            // if the left child does not exist.
            if (curr->l == nullptr) {
                newCurr = curr->r;
            }
            else {
                newCurr = curr->l;
            }

            // check if the node to
            // be deleted is the root.
            if (prev == nullptr) {

                if (curr->r != nullptr) {
                    newCurr = curr->r;
                    newCurr->parent = nullptr;
                    pRoot = newCurr;
                }
                else {   /**  closest left element must become the root. */
                    if (curr->l != nullptr) {
                        newCurr = curr->l;
                        newCurr->parent = nullptr;
                        pRoot = newCurr;
                    }

                }
                delete curr;
                return;
            }

            // check if the node to be deleted
            // is prev's left or right child
            // and then replace this with newCurr
            if (curr == prev->l) {
                prev->l = newCurr;
            }
            else {
                prev->r = newCurr;
            }

            // free memory of the
            // node to be deleted.
            newCurr->parent = prev;

            delete curr;
        }

            // node to be deleted has
            // two children.
        else {
            TreeNode* p = nullptr;
            TreeNode* temp;

            // Compute the inorder successor
            temp = curr->r;
            while (temp->l != nullptr) {
                p = temp;

                if (p->LeftCounter > 0) {
                    p->LeftCounter--;
                }

                temp = temp->l;
            }

            // check if the parent of the inorder
            // successor is the curr or not(i.e. curr=
            // the node which has the same data as
            // the given data by the user to be
            // deleted). if it isn't, then make the
            // the left child of its parent equal to
            // the inorder successor'd right child.
            if (p != nullptr) {
                p->l = temp->r;

                if (temp->r == nullptr)  {   /** No right subtree of the left minimum node. */
                    p->LeftCounter = 0;
                }
                else {   /** if there is right subtree of the left minimum node. */
                    p->LeftCounter = temp->RightCounter;
                    temp->r->parent = p;
                }

                if (curr->RightCounter > 0 ) {
                    curr->RightCounter--;
                }

            }

                // if the inorder successor was the
                // curr (i.e. curr = the node which has the
                // same data as the given data by the
                // user to be deleted), then make the
                // right child of the node to be
                // deleted equal to the right child of
                // the inorder successor.
            else {
                curr->r = temp->r;

                if (temp->r != nullptr) {
                    temp->r->parent = curr;
                }

                curr->RightCounter = temp->RightCounter;
            }

            strcpy(curr->data, temp->data);

            delete temp;
        }

    }/* end delete_elem()  */


    /*
     *    Classic version.  Traversal through the tree.
     *    Find wanted element by its number in sorted order
     *    and  return it.
     *    Use InOrder Traversal.
     *
     */
    char* get_by_num_no_recursive(TreeNode* troot, uint64_t num)
    {
        uint64_t  OrderNum = 0;

        stack<TreeNode* > s;
        TreeNode* curr = troot;
        //int count = 1;

        while (curr != nullptr || s.empty() == false)
        {
            /* Reach the left most Node of the
               curr Node */
            while (curr != nullptr)
            {
                /* place pointer to a tree node on
                   the stack before traversing
                  the node's left subtree */
                s.push(curr);
                curr = curr->l;
            }

            /* Current must be nullptr at this point */
            curr = s.top();
            s.pop();

            if (OrderNum == num) {
                return curr->data;
            }
            OrderNum++;


            /* we have visited the node and its
               left subtree.  Now, it's right
               subtree's turn */
            curr = curr->r;

        } /* end of while */

        return nullptr;

    }/*end  get_by_num_no_recursive() */


    /*
    *    Classic version.  Traversal through the tree.
    *    Find wanted element to delete by its number in sorted order
    *    and  delete it.
    *    use InOrder Traversal.
    *
    */
    void del_by_num_no_recursive(TreeNode* troot, uint64_t num)
    {
        uint64_t  OrderNum = 0;

        struct __NODE {
            TreeNode* curr;
            TreeNode* prev;
        }node;

        stack<struct __NODE> s;
        TreeNode* curr = troot;
        TreeNode* prev = nullptr;

        while (curr != nullptr || s.empty() == false)
        {

            /* Reach the left most Node of the
               curr Node */
            while (curr != NULL)
            {
                /* place pointer to a tree node on
                   the stack before traversing
                  the node's left subtree */

                node.curr = curr;
                node.prev = prev;
                s.push(node);

                if (curr->l != nullptr) {
                    prev = curr;
                }
                curr = curr->l;
            }

            /* Current must be NULL at this point */
            node = s.top();
            s.pop();
            curr = node.curr;
            prev = node.prev;

            if (OrderNum == num) {
                delete_elem(node.curr, node.prev);
                break;

            }
            OrderNum++;

            if (curr->r != nullptr) {
                prev = curr;
            }

            /* we have visited the node and its
               left subtree.  Now, it's right
               subtree's turn */
            curr = curr->r;

        } /* end of while */


    }/*end  del_by_num_no_recursive() - Classic version.  Traversal through the tree.*/



/*
 *    Support indices.
 *    Get an element by index from the tree.
 *
 */
    char* get_elem_by_index(TreeNode* proot, uint64_t ind)
    {

        char* pRet = nullptr;
        TreeNode* ptr = proot;
        uint64_t sought_for_ind = ind;

        if (proot == nullptr) {
            cout << "The Tree is Emty !!! ";
            return 0;
        }

        if (ind > (treeTotal-1) ) {
            cout << "Too big index to get,  index = " << ind << "  treeTotal = " << treeTotal << "  Stop. " << endl << endl;
            return 0;
        }

        while (ptr != nullptr) {

            if (sought_for_ind < ptr->LeftCounter) {   /** work out left branch */
                ptr = ptr->l;

                if (ptr == nullptr) {
                    cout << " DEBUG POINT XXX L: ptr = nullptr from Left   ind =  " << ind << endl;
                }

            }
            else if (sought_for_ind == ptr->LeftCounter) {
                return ptr->data;
            }
            else if (sought_for_ind > ptr->LeftCounter) {   /** work out right branch */

                sought_for_ind = sought_for_ind - ptr->LeftCounter - 1;

                if (ptr->r == nullptr) {
                    cout << " --DEBUG POINT XXX R: ptr->data=" << ptr->data << " ptr->LeftCounter=" <<
                         ptr->LeftCounter << "  ptr->RightCounter=" << ptr->RightCounter << endl;
                }

                ptr = ptr->r;

                if (ptr == nullptr) {
                    cout << " DEBUG POINT XXX R: ptr = nullptr from Right ind =  " << ind << endl;
                }

            }
        }


        return pRet;

    }/*ref. to get_elem_by_index() */




    /*
     *    Support indices.
     *    Delete an element by index from the tree.
     *
     */
    char* delete_elem_by_index(TreeNode* proot, uint64_t ind)
    {

        char* pRet = nullptr;
        TreeNode* ptr = proot;
        uint64_t sought_for_ind = ind;

        if (proot == nullptr) {
            cout << "Can not delete. The Tree is Emty !!! ";
            return 0;
        }

        if (ind > (treeTotal - 1)) {
            cout << "Too big index to delete,  index = " << ind << "  treeTotal = " << treeTotal << "  Stop. " << endl << endl;
            return 0;
        }


        while (ptr != nullptr) {

            if (sought_for_ind < ptr->LeftCounter) {   /** work out left branch */

                if (ptr->LeftCounter > 0) {
                    ptr->LeftCounter--;
                }
                ptr = ptr->l;

            }
            else if (sought_for_ind == ptr->LeftCounter) {
                delete_elem(ptr, ptr->parent);
                break;
            }
            if (sought_for_ind > ptr->LeftCounter) {   /** work out right branch */

                sought_for_ind = sought_for_ind - ptr->LeftCounter - 1;

                if (ptr->RightCounter > 0) {
                    ptr->RightCounter--;
                }

                ptr = ptr->r;

            }
        }


        return pRet;

    }/*ref. to delete_elem_by_index() */




public:
    void insert(const string& _str)
    {
        //TODO insert str with sorting
        push_no_recursive(_str.c_str(), &pRoot);    //put a node in the tree

    }/*ref. to insert() */




    void erase(uint64_t _index)
    {
        //TODO erase string via index
        //del_by_num_no_recursive(pRoot, _index);  //  - classic func.

        delete_elem_by_index(pRoot, _index);
        treeTotal--;

    }/** erase() */



    const string& get(uint64_t _index)
    {
        static string retStr;
        char* pGet;

        //TODO return string via index

        retStr.clear();

        //pGet=get_by_num_no_recursive(pRoot, _index); //  - classic func.

        pGet = get_elem_by_index(pRoot, _index);

        if (pGet != nullptr) {
            retStr.assign(pGet, std::strlen(pGet));
        }

        return retStr;
    }

    /*
     *  Can print tree's elements as
     *  sorted array.
     *  Useful for debug.
     */
    void print_container(TreeNode* container)
    {
        cout << "\nprint_container: " << endl;

        //Show_Simmetrich_no_recursive(pRoot);

        cout << "Get all elements in the tree by index:  \n";
        cout << "treeTotal  = " << treeTotal << endl << endl;;
        char* resNum = nullptr;
        for (int i = 0; i < static_cast<int>(treeTotal); i++) {

            resNum = get_elem_by_index(pRoot, i);
            cout << "[" << i << "] = " << resNum << endl;
        }
    }/* end of print_container() */




/*
 *  Recursive function.
 *  Return true if the tree is BST
 *  and false if the tree is not BST.
 */

    bool IsItBinarysearchTree(TreeNode* troot)
    {
        static TreeNode* prev = nullptr;

        if (troot == nullptr)
        {
            return true;
        }

        if (!IsItBinarysearchTree(troot->l))
        {
            return false;
        }

        if ((prev != nullptr) && (strcmp(troot->data, prev->data) < 0))
        {
            return false;
        }

        prev = troot;
        return IsItBinarysearchTree(troot->r);;

    }/*end of IsItBinarysearchTree() */




};/* ref. to class storage  */




int main()
{
    write_sequence write = get_sequence<write_sequence>("write.txt");
    modify_sequence modify = get_sequence<modify_sequence>("modify.txt");
    read_sequence read = get_sequence<read_sequence>("read.txt");

    storage st;

    time_point<system_clock> time1;
    nanoseconds total_time1(0);
    time1 = system_clock::now();

    for (const string& item : write)
    {
        st.insert(item);
    }

    cout << "Filling complete." << " The Tree size = " << st.treeTotal << " nodes." << endl;

    total_time1 += system_clock::now() - time1;
    cout << "Filling time: " << duration_cast<milliseconds>(total_time1).count() << "ms" << endl;

    uint64_t progress = 0;
    uint64_t percent = modify.size() / 100;
    ////uint64_t percent = modify.size() / 10000;

    time_point<system_clock> time;
    nanoseconds total_time(0);

    modify_sequence::const_iterator mitr = modify.begin();
    read_sequence::const_iterator ritr = read.begin();

    int deb_count = 0;
    for (; mitr != modify.end() && ritr != read.end(); ++mitr, ++ritr)
    {
        time = system_clock::now();

        st.erase(mitr->first);
        st.insert(mitr->second);
        const string& str = st.get(ritr->first);
        total_time += system_clock::now() - time;


        if (ritr->second != str)
        {
            cout << "test failed" << endl;
            //=============     DEBUG

            cout << "mitr->first = " << mitr->first << "   mitr->second = " << mitr->second <<
                 "   ritr->first = " << ritr->first << endl;
            cout << "ritr->second = " << ritr->second << "   str = " << str << endl;

            cout << "deb_count = " << deb_count << endl;  // FOR DEBUG ONLY.
            cout << "ritr->second = " << ritr->second << "  ritr->second.size() = " << ritr->second.size() << endl;
            cout << "str = " << str << "  str.size() = " << str.size() << endl;

            //============= END: DEBUG

            return 1;
        }

        // if size() / 100 = 0
        if (percent == 0) {
            percent = 1;
        }


        if (++progress % (5 * percent) == 0)
        {
            cout << "time: " << duration_cast<milliseconds>(total_time).count()
                 << "ms progress: " << progress << " / " << modify.size() << "\n";
        }

        //        cout << "deb_count = " << deb_count << "   progress = " << progress
        //            << "   percent = " << percent << endl;
        deb_count++;

    }

    cout << endl;
    cout << "===========" << endl;
    cout << "Test OK!" << endl;
    cout << "===========" << endl;

    /** Examine if the tree is BST  */
    bool  IsTheTreeBST = st.IsItBinarysearchTree(st.pRoot);
    if (IsTheTreeBST) {
        cout << "\n\n  This Tree Is The TRUE BST !!! \n\n";
    }
    else {
        cout << "\n\n  This Tree Is FALSE ??? \n\n";
    }
    /** END: Examine if the tree is BST  */

    return 0;
}

