#include <iostream>
#include <thread>


class SomeClass

{

public:

    SomeClass()

    {

        x1 = new char[ 1024 ];

        x2 = new char[ 1024 * 1024 ];

    }

private:

    char *x1;

    char *x2;

};

